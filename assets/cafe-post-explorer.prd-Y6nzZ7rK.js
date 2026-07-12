const e=`schemaVersion: 2
id: cafe-post-explorer
type: entity-crud
status: approved
title: 카페 게시글 탐색
purpose: 데이터 담당자가 Excel 기반 샘플 게시글을 등록·수정·삭제하고 현재 결과를 같은 양식의 Excel로 내려받는다.
primaryDecision: 어떤 게시글 데이터를 추가·수정·삭제한 뒤 Excel 결과로 확인할 것인가?
menuPath:
  - Sheet1
  - 게시글 목록
interactionMode: interactive
dataMode: in-memory
featureReferences: []
spreadsheetExport:
  fileName: cafe-posts.xlsx
  sheetName: Sheet1
  columns:
    - header: 카페명
      fieldRef: post.cafe-name
      exportFormat: text
    - header: 등록일시
      fieldRef: post.registered-date
      exportFormat: yyyy.mm.dd
    - header: 제목
      fieldRef: post.title
      exportFormat: text
    - header: 요약
      fieldRef: post.summary
      exportFormat: text
entity:
  id: cafe-post
  label: 카페 게시글
  primaryKey: post.id
  displayField: post.title
  fields:
    - id: post.id
      label: 게시글 ID
      dataType: string
      presentation: identifier
      required: true
      mutable: never
    - id: post.cafe-name
      label: 카페명
      dataType: string
      presentation: text
      required: true
      mutable: always
    - id: post.registered-date
      label: 등록일
      dataType: date
      presentation: text
      required: true
      mutable: always
    - id: post.title
      label: 제목
      dataType: string
      presentation: text
      required: true
      mutable: always
    - id: post.summary
      label: 요약
      dataType: text
      presentation: text
      required: false
      mutable: always
screens:
  - id: cafe-post.list
    type: list
    title: 카페 게시글 탐색
    description: 등록 기간과 카페명, 제목 또는 요약 검색어로 게시글을 찾습니다.
    filters:
      - id: filter.registered-date
        label: 등록 기간
        inputMode: date-range
        fieldRefs:
          - post.registered-date
      - id: filter.cafe-name
        label: 카페명
        inputMode: text
        fieldRefs:
          - post.cafe-name
        placeholder: 카페명 검색
      - id: filter.keyword
        label: 제목·요약 검색
        inputMode: text
        fieldRefs:
          - post.title
          - post.summary
        placeholder: 제목 또는 요약 검색
    columns:
      - id: column.registered-date
        fieldRef: post.registered-date
      - id: column.cafe-name
        fieldRef: post.cafe-name
      - id: column.title
        fieldRef: post.title
      - id: column.summary
        fieldRef: post.summary
    pagination:
      enabled: true
      defaultPageSize: 25
      pageSizeOptions:
        - 25
        - 50
        - 100
    actions:
      - id: action.create
        label: 게시글 등록
        kind: create
        targetScreenId: cafe-post.create
      - id: action.open-detail
        label: 상세 보기
        kind: navigate
        targetScreenId: cafe-post.detail
      - id: action.export
        label: Excel 내보내기
        kind: export
        resultMessageId: message.export-success
    selection:
      mode: none
    bulkActions: []
    states:
      - loading
      - empty
      - error
  - id: cafe-post.detail
    type: detail
    title: 카페 게시글 상세
    description: 저장된 카페 게시글 정보를 확인하고 필요한 항목을 수정합니다.
    fields:
      - post.cafe-name
      - post.registered-date
      - post.title
      - post.summary
    actions:
      - id: action.update
        label: 변경사항 저장
        kind: update
        resultMessageId: message.update-success
        errorMessageId: message.save-error
      - id: action.delete
        label: 게시글 삭제
        kind: delete
        confirmationMessageId: message.delete-confirm
        resultMessageId: message.delete-success
        errorMessageId: message.delete-error
      - id: action.close
        label: 닫기
        kind: close
    selection:
      mode: none
    bulkActions: []
    states:
      - ready
      - saving
      - save-error
  - id: cafe-post.create
    type: create-edit
    title: 카페 게시글 등록
    description: 원본 Excel 양식에 대응하는 카페 게시글 항목을 등록합니다.
    fields:
      - post.cafe-name
      - post.registered-date
      - post.title
      - post.summary
    actions:
      - id: action.submit-create
        label: 등록
        kind: create
        resultMessageId: message.create-success
        errorMessageId: message.save-error
      - id: action.cancel-create
        label: 취소
        kind: close
    selection:
      mode: none
    bulkActions: []
    states:
      - ready
      - saving
      - save-error
rules:
  - id: RULE-FIELDS-001
    category: fields
    severity: must
    statement: 카페명, 등록일, 제목과 요약은 등록 및 수정할 수 있고 내부 게시글 ID는 직접 편집하지 않는다.
    targets:
      - cafe-post.list
      - cafe-post.detail
      - cafe-post.create
      - post.id
      - post.cafe-name
      - post.registered-date
      - post.title
      - post.summary
  - id: RULE-FIELDS-002
    category: fields
    severity: must
    statement: 등록 기간과 카페명, 제목 또는 요약 검색어를 사용해 게시글을 탐색한다.
    targets:
      - filter.registered-date
      - filter.cafe-name
      - filter.keyword
  - id: RULE-ACTION-001
    category: buttons
    severity: must
    statement: 목록의 게시글을 선택하면 해당 게시글을 확인하고 수정할 수 있는 상세 화면을 연다.
    targets:
      - action.open-detail
      - cafe-post.detail
  - id: RULE-STATES-001
    category: states
    severity: must
    statement: 목록은 로딩, 빈 결과와 오류 상태를 구분하고 오류가 발생하면 다시 시도할 수 있게 안내한다.
    targets:
      - cafe-post.list
      - message.load-error
  - id: RULE-STATES-002
    category: states
    severity: must
    statement: 공개 가능한 샘플 게시글을 초기 데이터로 사용하고 등록·수정·삭제 결과는 현재 실행 세션의 목록에 반영한다.
    targets:
      - cafe-post.list
  - id: RULE-ACTION-002
    category: buttons
    severity: must
    statement: 현재 실행 세션의 게시글을 Sheet1 시트명, 원본 헤더 순서와 날짜 표기로 Excel 파일에 내보낸다.
    targets:
      - action.export
  - id: RULE-ACTION-003
    category: buttons
    severity: must
    statement: 화면에서 등록·수정·삭제한 게시글은 현재 실행 세션의 목록과 Excel 내보내기에 즉시 반영한다.
    targets:
      - action.create
      - action.submit-create
      - action.update
      - action.delete
messages:
  - id: message.load-error
    kind: error
    text: 카페 게시글을 불러오지 못했습니다. 다시 시도해 주세요.
  - id: message.export-success
    kind: success
    text: 원본과 같은 양식으로 Excel 파일을 만들었습니다.
  - id: message.create-success
    kind: success
    text: 카페 게시글을 등록했습니다.
  - id: message.update-success
    kind: success
    text: 카페 게시글을 수정했습니다.
  - id: message.delete-confirm
    kind: confirmation
    text: 이 게시글을 현재 세션에서 삭제하시겠습니까?
  - id: message.delete-success
    kind: success
    text: 카페 게시글을 삭제했습니다.
  - id: message.delete-error
    kind: error
    text: 카페 게시글을 삭제하지 못했습니다. 다시 시도해 주세요.
  - id: message.save-error
    kind: error
    text: 카페 게시글을 저장하지 못했습니다. 입력 내용을 확인하고 다시 시도해 주세요.
policy:
  profileRef: null
  coverageMode: declared-scenarios
  axes: []
  scenarios: []
navigation:
  - from: cafe-post.list
    actionId: action.create
    to: cafe-post.create
  - from: cafe-post.list
    actionId: action.open-detail
    to: cafe-post.detail
outOfScope:
  - 검토 상태, 태그와 담당자 관리
  - 원문 URL 표시와 원문 이동
  - 화면에서 Excel 파일을 업로드하거나 수집 작업을 실행하는 기능
  - 게시글 추이 대시보드
  - 새로고침 이후 등록·수정·삭제 결과 보존
  - 서버 또는 데이터베이스 영속 저장
openQuestions: []
`;export{e as default};
