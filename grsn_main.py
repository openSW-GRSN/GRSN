import stt
import tts

from multiprocessing import Process

def main():
    p1 = Process(target=stt.main)  # 함수 1을 위한 프로세스
    p2 = Process(target=tts.main)  # 함수 1을 위한 프로세스

    p1.start()
    p2.start()

if __name__ == "__main__":
    main()