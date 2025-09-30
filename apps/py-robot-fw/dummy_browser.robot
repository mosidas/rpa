*** Settings ***
Documentation     handle_dummy_browser_selenium.py の操作をRobot Frameworkで実装
Library           SeleniumLibrary

*** Variables ***
${BASE_URL}       http://localhost:3000/
${URL_FORM}       ${BASE_URL}account/form
${URL_CONFIRM}    ${BASE_URL}account/confirm
${WIDTH}          1300
${HEIGHT}         1300
${BROWSER}        edge

# 入力データ
${NAME}           あいう エオ
${AGE}            112
${GENDER_LABEL}   男性
${ADDRESS}        宇宙船地球号
${EMAIL}          aiu@examle.com
${PHONE}          090-1111-2222
${BIRTHDAY}       1888-09-30

*** Test Cases ***
Handle Dummy GUI
    [Documentation]    Dummy GUIの登録フォーム操作と確認画面の検証
    Set Selenium Speed    0.3 seconds
    Open Browser    ${BASE_URL}    ${BROWSER}
    Set Window Size    ${WIDTH}    ${HEIGHT}

    # account register
    Click Element    id=menu-register-account
    Sleep    1s
    Execute Javascript    window.scrollBy(0, 100)

    ${current}=    Get Location
    Should Be Equal    ${current}    ${URL_FORM}

    Input Text    id=name       ${NAME}
    Input Text    id=age        ${AGE}
    Select From List By Label    id=gender    ${GENDER_LABEL}
    Input Text    id=address    ${ADDRESS}
    Input Text    id=email      ${EMAIL}
    Input Text    id=phone      ${PHONE}
    Wait Until Element Is Visible    id=birthday    5s
    # input[type=date] 対応: 先頭に "00" を付けて送信（Selenium互換）
    Input Text    id=birthday   00${BIRTHDAY}

    Sleep    1s
    Click Element    id=submit-input
    Sleep    1s

    ${current2}=    Get Location
    Should Start With    ${current2}    ${URL_CONFIRM}

    ${v_name}=       Get Text    id=name
    ${v_age}=        Get Text    id=age
    ${v_gender}=     Get Text    id=gender
    ${v_address}=    Get Text    id=address
    ${v_email}=      Get Text    id=email
    ${v_phone}=      Get Text    id=phone
    ${v_birthday}=   Get Text    id=birthday

    Should Be Equal    ${v_name}       ${NAME}
    Should Be Equal    ${v_age}        ${AGE}
    Should Be Equal    ${v_gender}     ${GENDER_LABEL}
    Should Be Equal    ${v_address}    ${ADDRESS}
    Should Be Equal    ${v_email}      ${EMAIL}
    Should Be Equal    ${v_phone}      ${PHONE}
    Should Be Equal    ${v_birthday}   ${BIRTHDAY}

    Execute Javascript    window.scrollBy(0, 200)
    Execute Javascript    window.scrollBy(200, 0)

    [Teardown]    Close All Browsers
