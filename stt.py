#!/usr/bin/env python

# Copyright 2017 Google Inc. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Google Cloud Speech API sample application using the streaming API.

NOTE: This module requires the additional dependency `pyaudio`. To install
using pip:

    pip install pyaudio

Example usage:
    python stt.py
"""

# [stt 시작]
from __future__ import division

import re
import sys
import threading
import time

from google.cloud import speech

import pyaudio
from playsound import playsound
from six.moves import queue

import os

# json키 받아와서 서비스계정 인증
from tts import createsound, listcreate

credential_path = "polar-cyclist-322301-6eaca42ece96.json"
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = credential_path

import firebase_admin
from firebase_admin import credentials
# Import database module.
from firebase_admin import db

# 파베 키 받아와서 인증
cred = credentials.Certificate("grsn-43bdc-firebase-adminsdk-vw9kb-d9cfd744cb.json")

firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://grsn-43bdc-default-rtdb.firebaseio.com/'
})

# Audio recording parameters
RATE = 16000
CHUNK = int(RATE / 10)  # 100ms

global cheese
global double
global kebab
global tomato

global menu_play
menu_play = 0

global start_first
global menu_chchun
global menu_allergie
global menu_flavor
global menu_finish
global again_start

start_first = 0
menu_chchun = 0
menu_allergie = 0
menu_flavor = 0
menu_finish = 0
again_start = 1


class MicrophoneStream(object):
    """Opens a recording stream as a generator yielding the audio chunks.
       (오디오 청크(말 문단)를 생성하는 생성기로 녹음 스트림을 연다)"""

    def __init__(self, rate, chunk):
        self._rate = rate
        self._chunk = chunk

        # Create a thread-safe buffer of audio data
        self._buff = queue.Queue()
        self.closed = True

    def __enter__(self):
        self._audio_interface = pyaudio.PyAudio()
        self._audio_stream = self._audio_interface.open(
            format=pyaudio.paInt16,
            # The API currently only supports 1-channel (mono) audio
            # https://goo.gl/z757pE
            channels=1,
            rate=self._rate,
            input=True,
            frames_per_buffer=self._chunk,
            # Run the audio stream asynchronously to fill the buffer object.
            # 오디오 스트리밍을 비동기식으로 실행한다.
            # This is necessary so that the input device's buffer doesn't
            # overflow while the calling thread makes network requests, etc.
            stream_callback=self._fill_buffer,
        )

        self.closed = False

        return self

    def __exit__(self, type, value, traceback):
        self._audio_stream.stop_stream()
        self._audio_stream.close()
        self.closed = True
        # Signal the generator to terminate so that the client's
        # 발전기에 신호를 보내 고객(사용자)가 종료할 수 있다.
        # streaming_recognize method will not block the process termination.
        self._buff.put(None)
        self._audio_interface.terminate()

    def _fill_buffer(self, in_data, frame_count, time_info, status_flags):
        """Continuously collect data from the audio stream, into the buffer.
           (오디오 스트림에서 버퍼로 데이터를 계속 수집하는 중)"""
        self._buff.put(in_data)
        return None, pyaudio.paContinue

    def generator(self):
        while not self.closed:
            # Use a blocking get() to ensure there's at least one chunk of
            # data, and stop iteration if the chunk is None, indicating the
            # end of the audio stream.
            chunk = self._buff.get()
            if chunk is None:
                return
            data = [chunk]

            # Now consume whatever other data's still buffered.
            while True:
                try:
                    chunk = self._buff.get(block=False)
                    if chunk is None:
                        return
                    data.append(chunk)
                except queue.Empty:
                    break

            yield b"".join(data)


def listen_print_loop(responses):
    """Iterates through server responses and prints them.

    The responses passed is a generator that will block until a response
    is provided by the server.

    Each response may contain multiple results, and each result may contain
    multiple alternatives; for details, see https://goo.gl/tjCPAU.  Here we
    print only the transcription for the top alternative of the top result.

    In this case, responses are provided for interim results as well. If the
    response is an interim one, print a line feed at the end of it, to allow
    the next result to overwrite it, until the response is a final one. For the
    final one, print a newline to preserve the finalized transcription.
    서버 응답을 반복하여 인쇄한다.
    전달된 응답은 서버가 응답을 제공할 때까지 차단하는 생성기이다. (응답을 제공해야 응답을 함)
    """
    global menu_play

    num_chars_printed = 0

    for response in responses:
        if not response.results:

            continue

        # The `results` list is consecutive. For streaming, we only care about
        # the first result being considered, since once it's `is_final`, it
        # moves on to considering the next utterance.
        result = response.results[0]
        if not result.alternatives:

            continue

        # Display the transcription of the top alternative.
        global transcript
        transcript = result.alternatives[0].transcript

        global start_first
        global menu_chchun
        global menu_allergie
        global menu_flavor
        global menu_finish
        global again_start

        # Display interim results, but with a carriage return at the end of the
        # line, so subsequent lines will overwrite them.
        #
        # If the previous result was longer than this one, we need to print
        # some extra spaces to overwrite the previous result
        # 대충 중간 결과는 표시하지만 리턴은 마지막에 있고, 최종적으로 알아듣고 쓰는 text는 적당히(융통적으로) 덮어써가며 이용한다는 뜻
        overwrite_chars = " " * (num_chars_printed - len(transcript))

        if not result.is_final:
            sys.stdout.write(transcript + overwrite_chars + "\r")
            sys.stdout.flush()

            num_chars_printed = len(transcript)

        else:
            print(transcript + overwrite_chars)

            # Exit recognition if any of the transcribed phrases could be
            # one of our keywords.
            # '주문'이 들어간 문구를 말하면 종료하고 1초뒤에 다시 실행함
            if re.search("주문", transcript, re.I):
                output = "메뉴를 추천받으시겠습니까. 메뉴추천은 알레르기가 있는 분들을 위한 서비스입니다."
                createsound(output)
                play()
                start_first = 1

                print("종료하는중...")
                break

            if start_first == 1 and re.search("네|예|추천해주세요", transcript, re.I):
                # 메뉴추천화면으로 넘어감
                output = "메뉴 추천 화면입니다. '육류', '토마토', '유제품' 중 알레르기 반응이 있는 것을 선택해주세요."
                createsound(output)
                play()

                menu_chchun = 1
                start_first = 0

                print("종료하는중...")
                break

            if menu_chchun == 1 and re.search("육류|융뉴|융류|고기", transcript, re.I):
                # 육류 버튼이 선택됨(눌림)
                output3 = "육류"
                list_allergie(output3)
                play()

                menu_chchun = 0
                menu_allergie = 1

                print("종료하는중...")
                break

            if menu_chchun == 1 and re.search("토마토", transcript, re.I):
                # 육류 버튼이 선택됨(눌림)
                output3 = "토마토"
                list_allergie(output3)
                play()

                menu_chchun = 0
                menu_allergie = 1

                print("종료하는중...")
                break

            if menu_chchun == 1 and re.search("유제품|유제", transcript, re.I):
                # 육류 버튼이 선택됨(눌림)
                output3 = "유제품"
                list_allergie(output3)
                play()

                menu_chchun = 0
                menu_allergie = 1

                print("종료하는중...")
                break

            if menu_allergie == 1 and re.search("맛", transcript, re.I):
                output = "고객님께서 좋아하시는 맛은 어떤 맛인가요? 상큼한 맛, 화끈한 맛, 담백한 맛 중에 선택해주세요"
                createsound(output)
                play()

                menu_allergie = 0
                menu_flavor = 1

                print("종료하는중...")
                break

            if menu_flavor == 1 and re.search("상큼", transcript, re.I):
                # 육류 버튼이 선택됨(눌림)
                output3 = "상큼"
                list_flavor(output3)
                play()

                menu_flavor = 0
                menu_finish = 1

                print("종료하는중...")
                break

            if menu_flavor == 1 and re.search("화끈", transcript, re.I):
                # 육류 버튼이 선택됨(눌림)
                output3 = "화끈"
                list_flavor(output3)
                play()

                menu_flavor = 0
                menu_finish = 1

                print("종료하는중...")
                break

            if menu_flavor == 1 and re.search("담백", transcript, re.I):
                # 육류 버튼이 선택됨(눌림)
                output3 = "담백"
                list_flavor(output3)
                play()

                menu_flavor = 0
                menu_finish = 1

                print("종료하는중...")
                break

            if menu_finish == 1:
                ref = db.reference('tasteMenu')
                taste_menu = str(ref.get())
                output = "질문에 답변해주셔서 감사합니다. 고객님이 드실 수 있을만한 메뉴는" + taste_menu + "입니다"
                createsound(output)
                play()

                menu_finish = 0
                again_start = 1

                print("종료하는중...")
                break

            if start_first == 1 and re.search("아니요|아니오|아뇨", transcript, re.I):
                #   메뉴선택화면으로 넘어감
                list_play()

                start_first = 0

                print("종료하는중...")
                break

            #num_chars_printed = 0

            # 백엔드 모였을때 코드
            # ref.update({'stt 결과값': 1})

#메뉴선택화면
def play():
    playsound("output.mp3")

def list_play():
    output1 = "메뉴 선택 화면입니다. 현재 주문 가능한 메뉴는"
    ref = db.reference('setMenu')
    menu_list = str(ref.get())
    print(ref.get())
    print(type(menu_list))

    if re.search("cheese|치즈", menu_list, re.I):
        listcreate("치즈버거")

    if re.search("double|더블", menu_list, re.I):
        listcreate("더블버거")

    if re.search("kebab|케밥", menu_list, re.I):
        listcreate("케밥버거")

    if re.search("tomato|토마토", menu_list, re.I):
        listcreate("토마토버거")

    list_end = 1
    output2 = str(listcreate(list_end))
    output2 = output2.replace("]", "")
    createsound(output1 + output2 + "입니다")
    play()

def list_allergie(food):
    output4 = "고객님의 알레르기 제품으로" + food + ".를 선택하셨습니다. 맛 선택 화면으로 이동합니다."
    createsound(output4)
    play()

def list_flavor(flavor):
    output5 = flavor + "맛을 선택하셨습니다. 다음 화면으로 이동합니다."
    createsound(output5)
    playsound("output.mp3")



def main():
    # See http://g.co/cloud/speech/docs/languages
    # for a list of supported languages.
    language_code = "ko-KR"  # a BCP-47 language tag

    client = speech.SpeechClient()
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=RATE,
        language_code=language_code,
    )

    streaming_config = speech.StreamingRecognitionConfig(
        config=config, interim_results=True
    )

    with MicrophoneStream(RATE, CHUNK) as stream:
        audio_generator = stream.generator()
        requests = (
            speech.StreamingRecognizeRequest(audio_content=content)
            for content in audio_generator
        )

        responses = client.streaming_recognize(streaming_config, requests)

        # Now, put the transcription responses to use.
        listen_print_loop(responses)

        threading.Timer(0, main).start()


if __name__ == "__main__":
    main()
# [END stt]