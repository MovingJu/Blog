---
layout: post
title:  "[Project] Onvacation Project"
tagline: Project
author: MovingJu
categories: [Project, Research]
lastmode: 2025-11-24 12:00:00
sitemap:
  changefreq: daily
  priority : 1.0
comments: true
---

**글쓴이** : MovingJu

<br>

# Onvacation project

[Github](https://github.com/MovingJu/On-vacation-project)

Real-Time(Soft) C++ Server for DASOM On-Vacation Project

본 프로젝트는 브라우저에서 실시간으로 이미지 또는 스트림 데이터를 전송하면 C++ 서버가 YOLOv5 모델을 이용해 빠르게 추론하여 결과를 반환하는 실시간 비전 서비스입니다.

파이썬 기반 서버에서 발생하는 구조적 한계를 극복하고, 모델 추론 지연(latency)을 최소화하는 것이 핵심 목표입니다.

<br>

## 1. 프로젝트 개요

이 프로젝트는 다음 목표에서 출발했습니다:

- 모델 배포(Model Deployment)를 직접 경험하고자 함

- 연구용 모델과 실제 서비스형 모델의 차이를 파악

- Real-Time(soft) 수준의 빠른 추론이 가능한 서버 구조 설계

이를 위해 Yolo v5 모델을 이용한 Object Detection 서비스를 기획했습니다.

<br>

## 2. 왜 C++ 서버인가?

<br>

### 장점(Pros)

- 압도적인 속도 (Speed)

파이썬은 내부적으로 reference counting, 다양한 메타데이터 구조 때문에 dereference 과정에서 성능 병목이 발생함

C++은 불필요한 메타데이터가 없어 연산 속도가 훨씬 빠름

- 진정한 멀티스레딩 구현 가능

GIL이 없는 언어

atomic 기반의 lock-free 자료형 직접 구현 가능

<br>

### 단점(Cons)

- 안전성의 트레이드오프(사실상 포기)

포인터 오류가 즉시 프로그램 크래시로 이어짐

스레드 안전성(Thread Safety) 고려 필수

- 멀티스레딩 난이도

쓰레드 실행 순서 불확실성

읽기/수정/쓰기 사이의 데이터 레이스(Data Race) 문제

리소스 보호를 위한 올바른 디자인 패턴 필요

- 긴 개발 시간

기본 구조 없이는 설계가 까다로움

리팩토링 및 장기 유지보수에 적합

- 표준과 라이브러리 생태계의 모호함

외부 종속성 관리가 어렵고 기준이 명확하지 않음

<br>

## 3. 왜 C++이 위험한가? (Data Race 설명)

데이터 레이스는 다음 시나리오에서 발생합니다:

<br>

DRAM에 있는 변수 x 를 두 개의 스레드가 동시에 x++ 실행

각 스레드는 Register 로 값을 가져온 후 연산합니다. 

Thread 1: Read(0) -> 0++
Thread 2: Read(0) -> 0++

두 스레드 모두 1을 DRAM에 Write

기대값: 2
실제값: 1

따라서 atomic 자료형, mutex(lock)가 필수적입니다.

<br>

## 4. 서버 구조 및 디자인 패턴

프로젝트에서 채택한 핵심 패턴: Work-Queue Pattern

<br>

## 5. 직접 시연해보기 (Demo)

### 서비스 주소:
- [http://onvacation.movingju.com](http://onvacation.movingju.com)

```서버 내렸습니다. 다시 올릴 계획 없음```

### Requirement:
- Docker

### Execute Command:
```bash
docker pull movingju/public:cpp_server
docker run -p 8000:8000 movingju/public:cpp_server
```
> 도커는 이용 가능합니다.

<br>

## 6. 성능 (Performance)

300 FPS 서버 전송 주기

5명 동시 사용자 환경에서도 안정적으로 동작합니다.

하지만, 서버 전송 주기가 고정되어 있어서 이에 대한 개선이나 서버 수의 증가가 필요합니다.

여기까지, 실시간 추론 서비스로 충분히 빠른 응답성을 확보했습니다.

<br>

## 7. 앞으로의 개선 계획 (Backlogs)

- 모델 양자화 (INT8)

모델을 INT8 형태로 양자화하면
-> 추론 지연 감소
-> 모바일 및 엣지 디바이스 성능 향상

<br>

- Edge TPU 적용

Coral Edge TPU 등을 활용하여
-> 하드웨어 기반 초저지연 추론 실험 예정

<br>

- 실제 서비스 배포

데모 서버를 넘어서 완전한 실사용 가능한 실시간 추론 서비스로 확장 계획

> 세미나 여러분의 수요를 감당하기 위한 안정적 배포 환경 구축 필요했고, 임시로 로컬 컴퓨터에서 돌아가도록 구현했습니다.

<br>

## 8. 프로젝트 요약

C++ 기반 실시간 YOLOv5 추론 서버

Work-Queue 멀티스레드 구조로 낮은 latency를 실현

실시간 WebSocket 스트리밍 지원

Docker 기반 손쉬운 배포

향후 Edge TPU 및 INT8 최적화 계획

이상.