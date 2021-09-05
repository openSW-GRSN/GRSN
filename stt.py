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

# api 서비스계정 키 인증
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

global choice_all  # 고객님이 선택한 알레르기 제품
global choice_taste  # 고객님이 선택한 맛
global order_burger  # 고객님이 선택한 햄버거
global topping  # 토핑리스트
global add_topp  # 고객님이 추가한 토핑(재료)
topping = list()


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
    전달된 응답은 서버가 응답을 제공할 때까지 차단하는 생성기이다. 응답을 제공해야(말을 해야) 응답을 함
    """

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

        global choice_all       # 고객님이 선택한 알레르기 제품
        global choice_taste     # 고객님이 선택한 맛
        global order_burger     # 고객님이 선택한 햄버거
        global topping          # 토핑리스트
        global add_topp         # 고객님이 추가한 토핑(재료)
                # 토핑은 여러개 추가할 수 있음


        # Display interim results, but with a carriage return at the end of the
        # line, so subsequent lines will overwrite them.
        #
        # If the previous result was longer than this one, we need to print
        # some extra spaces to overwrite the previous result
        # 중간 결과는 표시하지만 리턴은 마지막에 있고, 최종적으로 알아듣고 쓰는 text는 적당히 덮어써가며 이용함
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
                output = "메뉴를 추천받으시겠습니까? 메뉴추천은 알레르기가 있는 분들을 위한 서비스입니다."
                createsound(output)
                play()

                print("종료하는중...")
                break

            # <메뉴 추천> 중 1단계 알레르기제품 고르기
            if re.search("네|예|추천해 주세요|추천해", transcript, re.I):
                # '네'라고 말하면 메뉴 추천 화면으로 넘어감
                output = "메뉴 추천 화면입니다. '육류', '토마토', '유제품' 중 알레르기 반응이 있는 것을 선택해주세요."
                createsound(output)
                play()

                print("종료하는중...")
                break

            if re.search("육류|융뉴|융류|역류|이용료|고기", transcript, re.I):
                # 육류 버튼이 선택됨(눌림)
                choice_all = "육류"
                print(choice_all)

                #print(output3)
                output = "고객님의 알레르기 제품으로" + choice_all + " 를 선택하셨습니다. '맛 선택'이라고 말씀하시면 맛 선택 화면으로 이동합니다."
                createsound(output)
                play()

                print("종료하는중...")
                break

            elif re.search("토마토", transcript, re.I):
                # 토마토 버튼이 선택됨(눌림)
                choice_all = "토마토"

                #print(output3)
                output = "고객님의 알레르기 제품으로 " + choice_all + " 를 선택하셨습니다. '맛 선택'이라고 말씀하시면 맛 선택 화면으로 이동합니다."
                createsound(output)
                play()

                print("종료하는중...")
                break

            elif re.search("유제품|유제", transcript, re.I):
                # 유제품 버튼이 선택됨(눌림)
                choice_all = "유제품"

                #print(output3)
                output = "고객님의 알레르기 제품으로" + choice_all + " 를 선택하셨습니다. '맛 선택'이라고 말씀하시면 맛 선택 화면으로 이동합니다."
                createsound(output)
                play()

                print("종료하는중...")
                break

            # 메뉴추천 중 2단계 맛 선택
            if re.search("맛 선택|맛선택", transcript, re.I):
                # '맛 선택'이라고 말하면 맛 선택 화면으로 넘어감
                output = "고객님께서 좋아하시는 맛은 어떤 맛인가요? 상큼한 맛, 화끈한 맛, 담백한 맛 중에 선택해주세요"
                createsound(output)
                play()

                print("종료하는중...")
                break

            if re.search("상큼", transcript, re.I):
                # 상큼한 맛 버튼이 선택됨(눌림)
                choice_taste = "상큼"
                output = choice_taste + "한 맛을 선택하셨습니다. '결과 보기'를 말씀하시면 결과 화면으로 이동합니다."
                createsound(output)
                playsound("output.mp3")

                print("종료하는중...")
                break

            if re.search("화끈", transcript, re.I):
                # 화끈한 맛 버튼이 선택됨(눌림)
                choice_taste = "화끈"
                output = choice_taste + "한 맛을 선택하셨습니다. '결과 보기'를 말씀하시면 결과 화면으로 이동합니다."
                createsound(output)
                playsound("output.mp3")

                print("종료하는중...")
                break

            if re.search("담백", transcript, re.I):
                # 담백한 맛 버튼이 선택됨(눌림)
                choice_taste = "담백"
                output = choice_taste + "한 맛을 선택하셨습니다. '결과 보기'를 말씀하시면 결과 화면으로 이동합니다."
                createsound(output)
                playsound("output.mp3")

                print("종료하는중...")
                break

            # 메뉴 추천 중 3단계 추천결과
            if re.search("결과|결과 보기|결과보기", transcript, re.I):
                # '결과'를 말하면 메뉴추천의 결과 화면으로 넘어감
                ref = db.reference('tasteMenu')
                taste_menu = str(ref.get())
                output = "질문에 답변해주셔서 감사합니다. 고객님이 드실 수 있을만한 메뉴는." + taste_menu + " 입니다. '메뉴'를 말씀하시면 메뉴리스트로 이동하니, 추천받은 버거종류를 선택해주세요"
                createsound(output)
                play()

                print("종료하는중...")
                break

            # <메뉴 선택>
            elif re.search("아니요|아니오|아뇨|메뉴", transcript, re.I):
                #  '아니오'라고 하면 메뉴 선택 화면으로 넘어감
                list_play()

                print("종료하는중...")
                break

            # 1단계 메뉴 선택하기 (예 : 치즈를 말하면 치즈버거가 선택됨)
            if re.search("치즈|cheese", transcript, re.I):
                # 치즈버거 '선택하기'버튼이 눌림
                order_burger = "치즈버거"
                output = order_burger + " 를 선택하셨습니다. '재료 추가'를 말씀하시면 재료 추가 화면으로 이동합니다."
                createsound(output)
                playsound("output.mp3")

                print("종료하는중...")
                break

            if re.search("토마토버거|토마토 버거", transcript, re.I):
                # 토마토버거 '선택하기'버튼이 눌림
                order_burger = "토마토버거"
                output = order_burger + " 를 선택하셨습니다. '재료 추가'를 말씀하시면 재료 추가 화면으로 이동합니다."
                createsound(output)
                playsound("output.mp3")

                print("종료하는중...")
                break

            if re.search("더블", transcript, re.I):
                # 더블버거 '선택하기'버튼이 눌림
                order_burger = "더블버거"
                output = order_burger + " 를 선택하셨습니다. '재료 추가'를 말씀하시면 재료 추가 화면으로 이동합니다."
                createsound(output)
                playsound("output.mp3")

                print("종료하는중...")
                break

            if re.search("케밥|kebab|개밥|캐밥|개 밥", transcript, re.I):
                # 케밥버거 '선택하기'버튼이 눌림
                order_burger = "케밥버거"
                output = order_burger + " 를 선택하셨습니다. '재료 추가'를 말씀하시면 재료 추가 화면으로 이동합니다."
                createsound(output)
                playsound("output.mp3")

                print("종료하는중...")
                break

            # 2단계 재료 추가
            if re.search("재료|재료추가|재료 추가|자료", transcript, re.I):
                # '재료추가'를 말하면 오른쪽 하단의'다음으로'버튼이 눌리면서 다음 화면(재료추가화면)으로 넘어감
                output = "고객님이 주문하신 햄버거에 '감자튀김', '음료' 그리고 '케첩 5개'를 재료로 추가하실 수 있습니다. 추가할 재료를 모두 선택해주세요"
                createsound(output)
                playsound("output.mp3")

                print("종료하는중...")
                break

            if re.search("감자튀김|감자 튀김", transcript, re.I):
                # 감자튀김 버튼이 선택됨(눌림), 토핑리스트에 감자튀김 추가
                add_topp = "감자튀김"
                topping.append("감자튀김")
                output = add_topp + "이 선택되었습니다. 재료를 더 추가하시려면 재료명을, 재료 추가를 끝내시려면 '확인'을 말씀해주세요"
                createsound(output)
                playsound("output.mp3")

                print("종료하는중...")
                break

            if re.search("음료", transcript, re.I):
                # 음료 버튼이 선택됨(눌림), 토핑리스트에 음료 추가
                add_topp = "음료"
                topping.append("음료")
                output = add_topp + "가 선택되었습니다. 재료를 더 추가하시려면 재료명을, 재료 추가를 끝내시려면 '확인'을 말씀해주세요"
                createsound(output)
                playsound("output.mp3")

                print("종료하는중...")
                break

            if re.search("케첩|케찹", transcript, re.I):
                # 케첩 버튼이 선택됨(눌림), 토핑리스트에 케첩 추가
                add_topp = "케첩 5개"
                topping.append('케첩 5개')
                createsound(add_topp+ "가 선택되었습니다. 재료를 더 추가하시려면 재료명을, 재료 추가를 끝내시려면 '확인'을 말씀해주세요")
                playsound("output.mp3")

                print("종료하는중...")
                break

            if re.search("확인", transcript, re.I):
                # 음성을 들려주기만할 뿐 액티비티는 x
                print(topping)
                top_str = str(topping)
                print(top_str)
                createsound("추가된 재료는" + top_str +"입니다. '결제'를 말씀하시면 결제창으로 이동합니다")
                playsound("output.mp3")

                print("종료하는중...")
                break

            # 최종 결제 화면
            if re.search("결제", transcript, re.I):
                # '결제'를 말하면 연주황색 '확인'버튼이 눌리면서 결제창으로 넘어감
                ref = db.reference('tatal')
                total = str(ref.get())
                createsound("선택된 메뉴는" + order_burger + "이며 추가된 재료는" + add_topp + "입니다. 총 결제 금액은" + total + "입니다")
                playsound("output.mp3")

                print("종료하는중...")
                break


            #num_chars_printed = 0

def play():
    playsound("output.mp3")

#메뉴선택화면에서 어떤 메뉴를 주문할 수 있는지(파베에 어떤 버거들이 있는지) 불러오기
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