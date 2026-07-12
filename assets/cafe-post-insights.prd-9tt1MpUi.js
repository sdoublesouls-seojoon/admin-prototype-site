const e=`schemaVersion: 2
id: cafe-post-insights
type: dashboard
status: approved
title: 카페 게시글 인사이트
purpose: 데이터 담당자가 공개 가능한 샘플 지표로 게시글 수집량, 카페 분포와 데이터 품질 화면의 컨셉을 검토한다.
primaryDecision: 어떤 샘플 지표를 보고 게시글 데이터의 분포와 품질을 추가로 확인할 것인가?
menuPath:
  - Sheet1
  - 인사이트
interactionMode: interactive
dataMode: in-memory
featureReferences: []
entity:
  id: cafe-post-metric
  label: 카페 게시글 지표
  primaryKey: metric.row-id
  displayField: metric.label
  fields:
    - id: metric.row-id
      label: 지표 행 ID
      dataType: string
      presentation: identifier
      required: true
      mutable: never
    - id: metric.id
      label: 지표 ID
      dataType: string
      presentation: identifier
      required: true
      mutable: never
    - id: metric.label
      label: 지표명
      dataType: string
      presentation: text
      required: true
      mutable: never
    - id: metric.period
      label: 샘플 기간
      dataType: enum
      presentation: text
      required: true
      mutable: never
      options:
        - value: sample-current
          label: 현재 샘플
          tone: neutral
        - value: sample-previous
          label: 이전 샘플
          tone: neutral
    - id: metric.current
      label: 현재값
      dataType: number
      presentation: number
      required: true
      mutable: never
    - id: metric.previous
      label: 비교값
      dataType: number
      presentation: number
      required: true
      mutable: never
    - id: metric.meaning
      label: 데이터 의미
      dataType: enum
      presentation: text
      required: true
      mutable: never
      options:
        - value: snapshot
          label: 단일 현황
          tone: neutral
        - value: period-comparison
          label: 기간 비교
          tone: info
        - value: trend
          label: 추세
          tone: positive
    - id: metric.trend
      label: 변화 방향
      dataType: enum
      presentation: status
      required: true
      mutable: never
      options:
        - value: up
          label: 증가
          tone: positive
        - value: flat
          label: 유지
          tone: neutral
        - value: down
          label: 감소
          tone: warning
    - id: metric.state
      label: 데이터 상태
      dataType: enum
      presentation: status
      required: true
      mutable: never
      options:
        - value: ready
          label: 정상
          tone: positive
        - value: error
          label: 일부 오류
          tone: danger
    - id: metric.detail
      label: 해석 안내
      dataType: text
      presentation: text
      required: false
      mutable: never
screens:
  - id: dashboard.cafe-post-insights
    type: dashboard
    title: 카페 게시글 인사이트
    description: 공개 가능한 샘플 지표로 수집 분포와 데이터 품질 화면을 검토합니다.
    filters:
      - id: filter.period
        label: 샘플 기간
        inputMode: single-select
        fieldRefs:
          - metric.period
        defaultValue: sample-current
        allLabel: 전체 샘플
    fields:
      - metric.id
      - metric.label
      - metric.current
      - metric.previous
      - metric.meaning
      - metric.trend
      - metric.state
      - metric.detail
    actions: []
    selection:
      mode: none
    bulkActions: []
    states:
      - loading
      - ready
      - empty
      - partial-error
      - error
rules:
  - id: RULE-FIELDS-001
    category: fields
    severity: must
    statement: 전체 게시글 수, 카페 수와 요약 누락을 공개 가능한 샘플 지표로 표시한다.
    targets:
      - dashboard.cafe-post-insights
      - metric.current
  - id: RULE-FIELDS-002
    category: fields
    severity: must
    statement: 상위 카페 비중과 이전 샘플 대비 변화를 데이터 의미에 맞는 시각화로 표시한다.
    targets:
      - dashboard.cafe-post-insights
      - metric.meaning
      - metric.previous
  - id: RULE-MESSAGES-001
    category: messages
    severity: must
    statement: 게시글 수는 샘플 수집량이며 관심도나 시장 성장률을 직접 의미하지 않는다고 안내한다.
    targets:
      - dashboard.cafe-post-insights
      - metric.detail
      - message.interpretation-caveat
  - id: RULE-STATES-001
    category: states
    severity: must
    statement: 인사이트 화면은 로딩, 데이터 없음, 일부 오류와 전체 오류 상태를 구분한다.
    targets:
      - dashboard.cafe-post-insights
      - metric.state
      - message.load-error
messages:
  - id: message.interpretation-caveat
    kind: info
    text: 게시글 수는 샘플 수집량이며 관심도나 시장 성장률을 직접 의미하지 않습니다.
  - id: message.load-error
    kind: error
    text: 카페 게시글 인사이트를 불러오지 못했습니다. 다시 시도해 주세요.
policy:
  profileRef: null
  coverageMode: declared-scenarios
  axes: []
  scenarios: []
navigation: []
outOfScope:
  - 실제 운영 데이터 집계
  - 게시글 목록의 등록·수정·삭제 결과를 인사이트에 즉시 반영하는 기능
  - 게시글 감성 분석과 주제 자동 분류
  - 게시글 수를 관심도 또는 시장 성장률로 해석하는 기능
  - 사용자 행동 로그 수집과 분석
openQuestions: []
`;export{e as default};
