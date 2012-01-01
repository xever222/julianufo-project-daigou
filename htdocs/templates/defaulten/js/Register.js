﻿function focusCheck(dom, str) { $(dom).attr("class", "on").next("p").attr("class", "prompt").text(str); }
function success(dom) { $(dom).attr("class", "").next("p").attr("class", "").html('<img src="/images/gou.gif" />'); }

var emailchecked = false;
function emailBlur(dom) {
    var email = $(dom).val();
    if ($.trim(email).length <= 0) { $(dom).attr("class", "").val("").next("p").attr("class", ""); emailchecked = false; }
    else {
        var reg = new RegExp("^\\w+([-+.']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$");
        if (reg.test($(dom).val())) {
            $.ajax({
                type: "POST",
                url: "/ajax/user_ajax.php?action=checkemail",
                dataType: "json",
                contentType: "application/json;utf-8",
                data: "{'email':'" + email.toLowerCase() + "'}",
                timeout: 10000,
                error: function(a, b, c) { emailchecked = true; $(dom).attr("class", "").next("p").attr("class", ""); },
                success: function(msg) {
                    if (msg!="OK") {
                        $(dom).attr("class", "wrong").next("p").attr("class", "red").text("Email地址已存在");
                        emailchecked = false;
                    }
                    else {
                        success(dom);
                        emailchecked = true;
                    }
                }
            });
        }
        else {
            $(dom).attr("class", "wrong").next("p").attr("class", "red").text("Email格式不正确");
            emailchecked = false;
        }
    }
}

var nicknamechecked = false;
function nicknameblur(dom) {
    var nickname = $.trim($(dom).val());
    if (nickname.length <= 0) { $(dom).attr("class", "").val("").next("p").attr("class", "").text("Nickname can be used as your login account"); nicknamechecked = false; }
    else {
        var regtest = new RegExp("^([\\u4e00-\\u9fa5]|\\w)*$");
        var regunderline = new RegExp("_");
        if (regtest.test(nickname) && regunderline.exec(nickname) == null) {
            var regEng = new RegExp("\\w", "g");
            var regCn = new RegExp("[\\u4e00-\\u9fa5]", "g");
            var nicknamelength = 0;
            var res;
            while ((res = regEng.exec(nickname)) != null)
                nicknamelength++;
            while ((res = regCn.exec(nickname)) != null)
                nicknamelength += 2;

            if (nicknamelength <= 16 && nicknamelength >= 4) {
                $.ajax({
                    type: "POST",
                    url: "/ajax/user_ajax.php?action=checkuname",
                    dataType: "json",
                    contentType: "application/json;utf-8",
                    data: "{'username':'" + nickname.toLowerCase() + "'}",
                    timeout: 10000,
                    error: function() { nicknamechecked = true; $(dom).attr("class", "").next("p").attr("class", ""); },
                    success: function(msg) {
                        if (msg!="OK") {
                            $(dom).attr("class", "wrong").next("p").attr("class", "red").text("User name already exists");
                            nicknamechecked = false;
                        }
                        else {
                            success(dom);
                            nicknamechecked = true;
                        }
                    }
                });
            }
            else {
                $(dom).attr("class", "wrong").next("p").attr("class", "red").text("2-8 nickname length must be 4-16 characters or characters");
                nicknamechecked = false;
            }
        }
        else {
 $(dom).attr("class", "wrong").next("p").attr("class", "red").text("Case letters, Chinese, numbers, characters or the length of 2-8 4-16 characters");
            nicknamechecked = false;
        }
    }
}

var passwordchecked = false;
function checkPassword(dom) {
    $("#passPower").hide();
    $(dom).next("p").show();
    var pass = $.trim($(dom).val());
    if (pass.length <= 0) { $(dom).attr("class", "").val("").next("p").attr("class", "").text("enter your password again"); passwordchecked = false; }
    else {
        var regtest = new RegExp("^(\\w)*$");
        if (regtest.test(pass)) {
            var regEng = new RegExp("\\w", "g");
            var passLength = 0;
            var res;
            while ((res = regEng.exec(pass)) != null)
                passLength++;

            if (passLength <= 20 && passLength >= 6) {
                success(dom);
                if ($("#regRePassword").val().length > 0) {
                    reCheckPassword("#regRePassword");
                }
                passwordchecked = true;
            }
            else {
                $(dom).attr("class", "wrong").next("p").attr("class", "red").text("密码长度必须是6-20个字符");
                passwordchecked = false;
            }
        }
        else {
            $(dom).attr("class", "wrong").next("p").attr("class", "red").text("密码必须是大小写英文字母、数字组成、长度为6-20个字符");
            passwordchecked = false;
        }
    }
}

function passPower(dom) {
    var pass = $(dom).val().toLowerCase();
    var powerRank = 0;
    if (pass.length > 0) {
        $(dom).next("p").hide();
        if (pass.length > 8) powerRank++;
        if (new RegExp("[0-9][a-z]|[a-z][0-9]").test(pass)) powerRank++;
        if (new RegExp("[0-9]+[a-z]+[0-9]+[a-z]|[a-z]+[0-9]+[a-z]+[0-9]").test(pass)) powerRank++;
        switch (powerRank) {
            case 0: $("#passPower").attr("class", "rank").text("安全等级：低"); break;
            case 1: $("#passPower").attr("class", "rank").text("安全等级：低"); break;
            case 2: $("#passPower").attr("class", "rank mid").text("安全等级：中"); break;
            case 3: $("#passPower").attr("class", "rank High").text("安全等级：高"); break;
            default: $("#passPower").attr("class", "rank").text("安全等级：低"); break;
        }
        $("#passPower").css("display", "inline");
    }
    else {
        $("#passPower").hide();
        $(dom).next("p").show();
    }
}

var repasschecked = false;
function reCheckPassword(dom) {
    var rePass = $.trim($(dom).val());
    if (rePass.length <= 0) {
        $(dom).attr("class", "").next("p").attr("class", "").text("enter your password again");
    } else {
        if ($.trim($("#regPassword").val()) == rePass) {
            success(dom);
            repasschecked = true;
        }
        else {
            $(dom).attr("class", "wrong").next("p").attr("class", "red").text("Inconsistent with the two password, please re-enter");
            repasschecked = false;
        }
    }
}

var checkcodechecked = false;
function checkCode(dom) {
    var checkCode = $.trim($(dom).val()).toLowerCase();
    if (checkCode == "") {
        $(dom).attr("class", "verification").nextAll("p").hide(); checkcodechecked = false;
    }
    else {
        $.ajax({
            type: "POST",
            url: "/ajax/user_ajax.php?action=checkcode&code=" + checkCode,
            dataType: "text",
            timeout: 10000,
            error: function(a, b, c) { checkcodechecked = true; },
            success: function(msg) {
                if (msg == '0') {
                    checkcodechecked = false;
                    $(dom).attr("class", "verification wrong").nextAll("p").show();
                }
                else {
                    checkcodechecked = true;
                    $(dom).attr("class", "verification").nextAll("p").hide();
                }
            }
        });
    }
}

function regSubmit() {
    if (!checkcodechecked) {
        var checkCode = $.trim($("#regCheckCodeInput").val()).toLowerCase();
        if (checkCode == "") {
            $("#regCheckCodeInput").attr("class", "verification").nextAll("p").show(); checkcodechecked = false;
        }
        else {
            $.ajax({
                type: "POST",
                url: "/ajax/user_ajax.php?action=checkcode&code=" + checkCode,
                dataType: "text",
                timeout: 5000,
                error: function(a, b, c) { checkcodechecked = true; regSucSubmit(); },
                success: function(msg) {
                    if (msg == '0') {
                        checkcodechecked = false;
                        $("#regCheckCodeInput").attr("class", "verification wrong").nextAll("p").show();
                    }
                    else {
                        checkcodechecked = true;
                        $("#regCheckCodeInput").attr("class", "verification").nextAll("p").hide();
                        regSucSubmit();
                    }
                }
            });
        }
    }
    else { regSucSubmit(); }
}


function regSucSubmit() {
    if ($.trim($("#regEmail").val()).length > 0) {
        if ($.trim($("#regNickName").val()).length > 0) {
            emailBlur($("#regEmail")); nicknameblur($("#regNickName")); checkPassword($("#regPassword")); reCheckPassword($("#regRePassword"));
            if (emailchecked && nicknamechecked && passwordchecked && repasschecked && document.getElementById("regAgree").checked) {
                $("form")[0].submit();
            } else {
                if (!document.getElementById("regAgree").checked)
                    alert("Read the registration agreement and check the consent box");
            }
        } else { $("#regNickName").attr("class", "wrong").next("p").attr("class", "red").text("enter your user name"); }
    }
    else { $("#regEmail").attr("class", "wrong").next("p").attr("class", "red").text("Enter Email Address"); }
}



$(document).ready(function() {
    $("#regCheckCodeInput").keydown(function(e) {
        if (e.keyCode == 13) regSubmit();
    })
});