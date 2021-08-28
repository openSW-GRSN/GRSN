#!/usr/bin/env python

# Copyright 2018 Google Inc. All Rights Reserved.
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

"""Google Cloud Text-To-Speech API sample application .

Example usage:
    python quickstart.py
"""

import os

credential_path = "polar-cyclist-322301-6eaca42ece96.json"
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = credential_path

import firebase_admin
from firebase_admin import credentials
# Import database module.
from firebase_admin import db

cred = credentials.Certificate("grsn-43bdc-firebase-adminsdk-vw9kb-d9cfd744cb.json")

firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://grsn-43bdc-default-rtdb.firebaseio.com/'
})

ref = db.reference('stt') #db 위치 지정


def run_quickstart():
    # [START tts_quickstart]
    """Synthesizes speech from the input string of text or ssml.

    Note: ssml must be well-formed according to:
        https://www.w3.org/TR/speech-synthesis/
    """
    from google.cloud import texttospeech

    # Instantiates a client
    client = texttospeech.TextToSpeechClient()

    #sentence = input("음성으로 변환할 텍스트를 입력하세요 : ")

    # Set the text input to be synthesized
    # 읽어줄 텍스트 입력하기
    synthesis_input = texttospeech.SynthesisInput(text="안녕하세요")

    # Build the voice request, select the language code ("en-US") and the ssml
    # voice gender ("neutral")
    voice = texttospeech.VoiceSelectionParams(
        language_code="ko-KR",
        ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL
    )

    # Select the type of audio file you want returned
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3
    )

    # Perform the text-to-speech request on the text input with the selected
    # voice parameters and audio file type
    response = client.synthesize_speech(
        input=synthesis_input, voice=voice, audio_config=audio_config
    )

    #ttsOutput = input("저장할 파일의 이름과 확장자명을 입력하세요(파일이름.mp3) : ")

    # The response's audio_content is binary.
    # 음성으로 변환한 파일 저장할 때 설정
    with open("hello.mp3", "wb") as out:
        # Write the response to the output file.
        ref.update({'stt 결과값': 0})
        out.write(response.audio_content)
        print('음성파일이 저장되었습니다.')

    # [END tts_quickstart]


if __name__ == "__main__":
    run_quickstart()
