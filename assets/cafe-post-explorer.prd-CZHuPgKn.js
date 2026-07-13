const e=`schemaVersion: 3
id: cafe-post-explorer
type: entity-crud
status: approved
title: 카페 게시글 탐색
purpose: 데이터 담당자가 Excel 기반 샘플 게시글을 등록·수정·삭제하고 현재 결과를 같은 양식의 Excel로 내려받는다.
primaryUser: Excel 기반 게시글 데이터를 관리하는 데이터 담당자
primaryDecision: 어떤 게시글 데이터를 추가·수정·삭제한 뒤 Excel 결과로 확인할 것인가?
menuPath:
  - Sheet1
  - 게시글 목록
interactionMode: interactive
dataMode: in-memory
featureReferences: []
workflows:
  - id: workflow.explore-posts
    title: 게시글 탐색과 변경
    goal: 게시글을 찾고 필요한 데이터를 등록·수정·삭제하거나 Excel로 확인한다.
    steps:
      - id: step.review-list
        title: 게시글 목록 확인
        screenId: cafe-post.list
        filterId: filter.keyword
        scenarioIds: [scenario.list-ready, scenario.list-loading, scenario.list-empty, scenario.list-error, scenario.export-success]
      - id: step.open-detail
        title: 게시글 상세 열기
        screenId: cafe-post.list
        actionId: action.open-detail
        scenarioIds: [scenario.update-success, scenario.update-error, scenario.delete-success, scenario.delete-error]
      - id: step.close-detail
        title: 게시글 상세 닫기
        screenId: cafe-post.detail
        actionId: action.close
        scenarioIds: [scenario.update-success]
      - id: step.open-create
        title: 게시글 등록 시작
        screenId: cafe-post.list
        actionId: action.create
        scenarioIds: [scenario.create-success, scenario.input-error, scenario.create-error]
      - id: step.cancel-create
        title: 게시글 등록 취소
        screenId: cafe-post.create
        actionId: action.cancel-create
        scenarioIds: [scenario.input-error]
scenarios:
  - id: scenario.list-ready
    workflowId: workflow.explore-posts
    title: 게시글 목록 정상 조회
    type: success
    screenId: cafe-post.list
    preconditions: [공개 가능한 샘플 게시글 fixture가 준비되어 있다.]
    trigger: { kind: system-event, event: load, description: 게시글 목록을 연다. }
    expectedResult: 게시글 목록과 필터가 표시된다.
    stateChanges: [{ kind: screen, state: ready }]
    messageUsages: []
    recovery: { kind: none }
    ruleIds: [RULE-FIELDS-001, RULE-FIELDS-002, RULE-STATES-002]
    review: { mode: prototype, fixtureRef: default, initialState: ready, steps: [게시글 목록을 연다., 필터와 목록 항목을 확인한다.] }
  - id: scenario.create-success
    workflowId: workflow.explore-posts
    title: 게시글 등록 성공
    type: success
    screenId: cafe-post.create
    actionId: action.submit-create
    preconditions: [필수 입력값을 모두 입력했다.]
    trigger: { kind: user-action, description: 등록을 선택한다. }
    expectedResult: 새 게시글이 현재 실행 세션의 목록에 추가된다.
    stateChanges: [{ kind: screen, state: ready }]
    messageUsages:
      - { phase: result, placement: toast, ref: { source: prd, messageId: message.create-success } }
    recovery: { kind: none }
    ruleIds: [RULE-FIELDS-001, RULE-ACTION-003]
    review: { mode: prototype, fixtureRef: default, initialState: ready, steps: [게시글 등록을 연다., 필수값을 입력하고 등록한다., 성공 메시지와 목록 반영을 확인한다.] }
  - id: scenario.update-success
    workflowId: workflow.explore-posts
    title: 게시글 수정 성공
    type: success
    screenId: cafe-post.detail
    actionId: action.update
    preconditions: [수정할 게시글 상세를 열고 값을 변경했다.]
    trigger: { kind: user-action, description: 변경사항 저장을 선택한다. }
    expectedResult: 변경 내용이 현재 실행 세션의 목록에 반영된다.
    stateChanges: [{ kind: screen, state: ready }]
    messageUsages:
      - { phase: result, placement: toast, ref: { source: prd, messageId: message.update-success } }
    recovery: { kind: none }
    ruleIds: [RULE-ACTION-001, RULE-ACTION-003]
    review: { mode: prototype, fixtureRef: default, initialState: ready, steps: [첫 게시글 상세를 연다., 제목을 변경하고 저장한다., 성공 메시지를 확인한다.] }
  - id: scenario.delete-success
    workflowId: workflow.explore-posts
    title: 게시글 삭제 성공
    type: success
    screenId: cafe-post.detail
    actionId: action.delete
    preconditions: [삭제할 게시글 상세를 열었다.]
    trigger: { kind: user-action, description: 게시글 삭제를 확인한다. }
    expectedResult: 게시글이 현재 실행 세션의 목록에서 제거된다.
    stateChanges: [{ kind: screen, state: ready }]
    messageUsages:
      - { phase: confirmation, placement: dialog, ref: { source: prd, messageId: message.delete-confirm } }
      - { phase: result, placement: toast, ref: { source: prd, messageId: message.delete-success } }
    recovery: { kind: none }
    ruleIds: [RULE-ACTION-003]
    review: { mode: prototype, fixtureRef: default, initialState: ready, steps: [첫 게시글 상세를 연다., 삭제를 선택하고 확인한다., 목록 제거와 성공 메시지를 확인한다.] }
  - id: scenario.export-success
    workflowId: workflow.explore-posts
    title: Excel 내보내기 성공
    type: success
    screenId: cafe-post.list
    actionId: action.export
    preconditions: [현재 실행 세션에 게시글 데이터가 있다.]
    trigger: { kind: user-action, description: Excel 내보내기를 선택한다. }
    expectedResult: 선언된 Sheet1 헤더와 날짜 형식으로 Excel 파일을 만든다.
    stateChanges: [{ kind: none }]
    messageUsages:
      - { phase: result, placement: toast, ref: { source: prd, messageId: message.export-success } }
    recovery: { kind: none }
    ruleIds: [RULE-ACTION-002]
    review: { mode: prototype, fixtureRef: default, initialState: ready, steps: [Excel 내보내기를 선택한다., 생성 결과 메시지를 확인한다.] }
  - id: scenario.input-error
    workflowId: workflow.explore-posts
    title: 필수 입력 오류
    type: input-error
    screenId: cafe-post.create
    actionId: action.submit-create
    preconditions: [게시글 등록 화면을 열었다., 제목을 입력하지 않았다.]
    trigger: { kind: user-action, description: 등록을 선택한다. }
    expectedResult: 등록되지 않고 제목 필드의 오류를 안내한다.
    stateChanges: [{ kind: screen, state: input-error }]
    messageUsages:
      - { phase: validation, placement: field, fieldRef: post.title, ref: { source: prd, messageId: message.required-title } }
    recovery: { kind: edit-input, description: 제목을 입력한 뒤 다시 등록한다., actionId: action.submit-create, preservesInput: true }
    ruleIds: [RULE-FIELDS-001]
    review:
      mode: prototype
      fixtureRef: default
      initialState: input-error
      inputOverrides: { post.title: "" }
      steps: [게시글 등록을 연다., 제목을 비운 채 등록한다., 필드 오류와 입력값 보존을 확인한다.]
  - id: scenario.update-error
    workflowId: workflow.explore-posts
    title: 게시글 저장 실패
    type: persistence-error
    screenId: cafe-post.detail
    actionId: action.update
    preconditions: [수정할 게시글의 값을 변경했다.]
    trigger: { kind: user-action, description: 변경사항 저장을 선택한다. }
    expectedResult: 변경값을 유지하고 첫 저장 시도만 실패한다.
    stateChanges: [{ kind: screen, state: save-error }]
    messageUsages:
      - { phase: failure, placement: panel, ref: { source: prd, messageId: message.save-error } }
    recovery: { kind: retry, description: 입력값을 유지한 채 다시 저장한다., actionId: action.update, preservesInput: true }
    ruleIds: [RULE-ACTION-003]
    review: { mode: prototype, fixtureRef: default, initialState: save-error, fault: { phase: mutation, failAttempts: 1 }, steps: [첫 게시글 상세를 연다., 값을 변경하고 저장한다., 오류와 입력 보존을 확인한 뒤 다시 저장한다.] }
  - id: scenario.create-error
    workflowId: workflow.explore-posts
    title: 게시글 등록 저장 실패
    type: persistence-error
    screenId: cafe-post.create
    actionId: action.submit-create
    preconditions: [필수 입력값을 모두 입력했다.]
    trigger: { kind: user-action, description: 등록을 선택한다. }
    expectedResult: 입력값을 유지하고 첫 등록 시도만 실패한다.
    stateChanges: [{ kind: screen, state: save-error }]
    messageUsages:
      - { phase: failure, placement: panel, ref: { source: prd, messageId: message.save-error } }
    recovery: { kind: retry, description: 입력값을 유지한 채 다시 등록한다., actionId: action.submit-create, preservesInput: true }
    ruleIds: [RULE-ACTION-003]
    review: { mode: prototype, fixtureRef: default, initialState: save-error, fault: { phase: mutation, failAttempts: 1 }, steps: [게시글 등록을 연다., 필수값을 입력하고 등록한다., 오류와 입력 보존을 확인한 뒤 다시 등록한다.] }
  - id: scenario.delete-error
    workflowId: workflow.explore-posts
    title: 게시글 삭제 실패
    type: persistence-error
    screenId: cafe-post.detail
    actionId: action.delete
    preconditions: [삭제할 게시글 상세를 열었다.]
    trigger: { kind: user-action, description: 게시글 삭제를 확인한다. }
    expectedResult: 게시글을 유지하고 첫 삭제 시도만 실패한다.
    stateChanges: [{ kind: screen, state: save-error }]
    messageUsages:
      - { phase: confirmation, placement: dialog, ref: { source: prd, messageId: message.delete-confirm } }
      - { phase: failure, placement: panel, ref: { source: prd, messageId: message.delete-error } }
    recovery: { kind: retry, description: 게시글을 유지한 채 삭제를 다시 시도한다., actionId: action.delete, preservesInput: true }
    ruleIds: [RULE-ACTION-003]
    review: { mode: prototype, fixtureRef: default, initialState: save-error, fault: { phase: mutation, failAttempts: 1 }, steps: [첫 게시글 상세를 연다., 삭제를 확인한다., 삭제 실패와 게시글 보존을 확인한다.] }
  - id: scenario.list-loading
    workflowId: workflow.explore-posts
    title: 게시글 목록 로딩
    type: loading
    screenId: cafe-post.list
    preconditions: [게시글 목록 조회가 시작되었다.]
    trigger: { kind: system-event, event: load, description: 게시글 목록을 불러온다. }
    expectedResult: 로딩 상태를 표시한다.
    stateChanges: [{ kind: screen, state: loading }]
    messageUsages: []
    recovery: { kind: none }
    ruleIds: [RULE-STATES-001]
    review: { mode: prototype, fixtureRef: default, initialState: loading, steps: [로딩 상태와 화면 구조를 확인한다.] }
  - id: scenario.list-empty
    workflowId: workflow.explore-posts
    title: 게시글 빈 결과
    type: empty
    screenId: cafe-post.list
    preconditions: [조회 조건에 맞는 게시글이 없다.]
    trigger: { kind: system-event, event: render, description: 빈 조회 결과를 표시한다. }
    expectedResult: 빈 상태 제목과 안내를 표시한다.
    stateChanges: [{ kind: screen, state: empty }]
    messageUsages:
      - { phase: state, placement: empty-state, ref: { source: theme, voiceKey: emptyTitle } }
      - { phase: state, placement: empty-state, ref: { source: theme, voiceKey: emptyBody } }
    recovery: { kind: dismiss, description: 필터를 변경하거나 게시글을 등록한다., preservesInput: true }
    ruleIds: [RULE-STATES-001]
    review: { mode: prototype, fixtureRef: default, initialState: empty, steps: [빈 결과의 제목과 안내를 확인한다.] }
  - id: scenario.list-error
    workflowId: workflow.explore-posts
    title: 게시글 목록 조회 실패
    type: load-error
    screenId: cafe-post.list
    preconditions: [게시글 목록 조회에 실패했다.]
    trigger: { kind: system-event, event: load, description: 게시글 목록 조회 오류가 발생한다. }
    expectedResult: 오류 안내와 다시 시도 행동을 표시한다.
    stateChanges: [{ kind: screen, state: error }]
    messageUsages:
      - { phase: failure, placement: panel, ref: { source: prd, messageId: message.load-error } }
    recovery: { kind: retry, description: 게시글 목록 조회를 다시 시도한다., preservesInput: true }
    ruleIds: [RULE-STATES-001]
    review: { mode: prototype, fixtureRef: default, initialState: error, fault: { phase: load, failAttempts: 1 }, steps: [조회 오류와 다시 시도 행동을 확인한다., 다시 시도 후 목록 복구를 확인한다.] }
scenarioCoverage:
  success: { status: covered, scenarioIds: [scenario.list-ready, scenario.create-success, scenario.update-success, scenario.delete-success, scenario.export-success] }
  inputError: { status: covered, scenarioIds: [scenario.input-error] }
  businessRuleBlocked: { status: not-applicable, reason: 이 기능에는 상태나 권한에 따라 실행을 차단하는 업무 규칙이 선언되어 있지 않다. }
  persistenceError: { status: covered, scenarioIds: [scenario.create-error, scenario.update-error, scenario.delete-error] }
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
  - id: message.required-title
    kind: error
    text: 제목을 입력해 주세요.
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
