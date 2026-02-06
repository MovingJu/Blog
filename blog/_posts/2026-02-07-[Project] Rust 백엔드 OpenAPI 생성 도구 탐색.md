---
layout: post
title:  "[Project] Rust 백엔드 OpenAPI 생성 도구 탐색"
tagline: Project
author: MovingJu
categories: [Project]
lastmode: 2026-02-07 12:00:00
sitemap:
  changefreq: daily
  priority : 1.0
comments: true
---

**글쓴이** : MovingJu

# Backend OpenAPI
---

백엔드 서비스를 만들다보면 `API` 명세서를 만들일이 많다.

이는 매우매우 귀찮은 작업으로 코드 구조화, 선언, 데이터베이스 마이그레이션, 주석 등 이미 많은 정보가 있음에도 `API` 명세서를 노션이나 슬랙에 기입하는 것은 상당히 번거롭다.

이를 위해 준비된 라이브러리들이 있으니, `OpenAPI` 생성 도구들이다.

이러한 도구들은 다양한 언어 전반에 존재하고, `OpenAPI.json` 파일만으로도 보기 좋으며 테스트도 해볼 수 있는 `UI`도 생성해준다.

이번엔 `Rust`에서 `OpenAPI` 생성 도구 탐험 과정을 공유해보려 한다.

# Environments
---

- `Rust` : 2024 edition
- `Frameworks` : 
  - `axum` : 0.8.1
  - `aide` : 0.16.0-alpha2 (features = ["redoc", "swagger", "scalar", "axum-json", "axum-query"])

You can check it out on [this repo](https://github.com/MovingJu/api.movingju.com).

# Utoipa
---

[Utoipa](https://crates.io/crates/utoipa)는 이 분야 최강 프레임워크로, 가장 많은 다운로드 수를 자랑한다.

그 만큼 커뮤니티가 성숙하며 많은 웹 프레임워크들을 지원하지만, 코드 리딩을 굉장히 힘들게 만든다.

```rust
#[utoipa::path(
    get,
    tag = "users",
    path = "/get_users",
    responses(
        (status = 200, body = ApiResponse<UserResp>, description = "JSON response.")
    )
)]
pub async fn get_users() -> Json<ApiResponse<UserResp>> {
    info!("Request to get users table.");
    Json(ApiResponse {
        code: 200,
        resp: "ok".to_string(),
        data: UserResp {
            id: 1,
            name: "MovingJu".to_string(),
            email: None,
        },
    })
}
```
이만큼이 `API` route 하나의 구현이고

```rust
#[derive(OpenApi)]
#[openapi(
    paths(get_users, set_users),
    tags((
        name = "users",
        description = "APIs for manipulating users table."
    ))
)]
pub struct UsersApi;
/// # get_router
/// Adds route easily in `main.rs` file.
pub fn get_router() -> Router {
    Router::new()
        .route("/get_users", get(get_users))
        .route("/set_users", get(set_users))
        .with_prefix("/users")
}
```
거의 각 파일마다 `OpenAPI` 생성을 위해 구현의 코드 줄 만큼을 매크로 작성에 사용해야 한다.

`FastAPI`를 사용하다 온 나로선 이 프레임워크를 왜 쓰는지 모르겠다. 

아마 actix-web을 사용하는 사람들은 이 프레임워크를 쓸 수 밖에 없나본데, 코드의 반복이 정말 너무 심하다.

하나의 API 엔드포인트가 `/api/v1/user` 라고 딱 한번 지정했으면 모든 곳에 반영되어야 하지 않을까.

~~기능을 함수화 해서 묶으라고 그렇게 강조하는 개발자들이 이런건 왜 재사용 안하는지 모르겠다.~~

`Rust` 언어는 컴파일 타임에 거의 모든 것이 결정되어야 하기에 메크로를 이용하는 구조를 취했나본데 솔직히 별로다.

다음이 그래서 채용한 대안이고, 나의 [public API](https://api.movingju.com)도 현재 이걸로 작동 중이다.

# Aide
---

~~다른 딥러닝 깃허브가 생각나지만,~~ `aide`는 거의 `axum` 전용 프레임워크이다.

나같은 경우 `axum`의 `tokio` 친화적인 환경을 너무 잘 사용하고 있기에 별 문제는 없었다.

우선 route 선언 코드를 보면

```rust
pub async fn get_users() -> impl IntoJsonResponse {
    info!("Request to get users table.");
    Json(ApiResponse {
        code: 200,
        resp: "ok".to_string(),
        data: UserResp {
            id: 1,
            name: "MovingJu".to_string(),
            email: None,
        },
    })
}
```

`utoipa`의 선언이 없어지니 크기도 많이 줄었고, 리턴값도 템플릿을 통해 추상화 되어있다.

route를 합칠 때

```rust
let app = adie::axum::ApiRouter::new()
        .merge(routes::index::get_router())
        .merge(routes::apis::get_router(state.clone()))
        .nest_api_service("/docs", routes::apis::docs_routes(state.clone()))
        .route("/full_api.json", get(serve_api));
```

adie에서 제공하는 `ApiRouter` 객체를 이용하기만 하면 된다.

정말 경량 라이브러리라 과장 조금 보태서 1시간이면 docs.rs를 다 읽고 실전에 사용해볼 수 있다.

조그만한 단점으론 아직 성장중인 프레임워크, 커뮤니티라는 점이 있다.

## Trait Bugs
---

[Environments](#environments)에서 왜 alpha 버전을 사용했는지 의아할 수도 있다.

그 이유는 0.16.0 버전 아래를 사용하면 `async` 함수의 리턴 타입을 잘 래핑하지 못했는지 복잡한 `trait` 에러가 발생하기 때문이다.

프레임워크 내부에서 모든 것을 새 구조체, `trait`으로 감싸놨는지 디버깅 하기가 정말 힘들었다.

```rust
the trait bound fn(Json) -> ... {JsonResponse}: OperationHandler<_, _> is not satisfied
```
~~어쩌라는 건지 전혀 알 수 없는 에러메세지이다...~~

[이 Discussion](https://github.com/tamasfe/aide/discussions/179)에 있는 에러 메시지를 보면 알 수 있듯, 프레임워크 개발자가 아니면 파악하기 참 힘들다.

일단 내가 찾아낸 해결책은 

- aide0.16.0-alpha2 이상의 버전을 사용
- axum Query 등 axum 기능이 route에 영향을 끼칠 경우 반드시 관련 feature를 포함할 것

이렇게 2가지 이다.

이것만 잘 지켜준다면 정말 행복하게 `Rust` 백엔드 코딩을 즐길 수 있다.

## 왜 이렇게까지...
---

이 아래는 내 개인적 얘기이다.

최근 Rust 개발을 하며 이거 왜 하냐고 물어보는 사람들이 많다.

~~Rust 커뮤니티 사람들이 구린건 맞지만~~ 최신 프로그래밍 언어 철학과 기능들을 사용해볼 수 있다는 것이 굉장히 흥미롭다.

가변 변수를 위해선 ```let mut```으로만 선언해야 하는 등, 이런 사소한 디테일부터 공식 모든 언어 최강급 패키지 관리 도구까지

코딩보다 링킹, 문서 읽기에 훨~씬 많은 시간을 들여야 하는 [어느 언어..](https://en.cppreference.com/w/)와 다르게 참 쾌적하다는 생각까지 든다.

`Python`으로 `PIP` 배포 혹은 `Unittest`에서 `mock` 객체를 활용해본 적 없는 것 같은 사람이 "너 `C++`는 제대로 하고 하는거니??" 라고 하면 좀 짜증나긴 한다.

`Rust`가 모든 코드를 지배하는 수준까지 가진 않더라도 한국에서 `Rust` 관련 문서가 많이 늘었으면 하는 개인적 바람이 있다.

나도 여기에 기여한게 아닐까.

이상.