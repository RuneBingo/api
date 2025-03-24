/* DO NOT EDIT, file generated by nestjs-i18n */

/* eslint-disable */
/* prettier-ignore */
import { Path } from "nestjs-i18n";
/* prettier-ignore */
export type I18nTranslations = {
    "auth": {
        "signInWithEmail": {
            "userNotFound": string;
            "userDisabled": string;
        };
        "signUpWithEmail": {
            "emailAlreadyExists": string;
            "usernameAlreadyExists": string;
        };
        "verifyAuthCode": {
            "invalidOrExpired": string;
            "accountDeleted": string;
        };
        "roles": {
            "admin": string;
            "moderator": string;
            "user": string;
        };
    };
    "bingo": {
        "findById": {
            "notFound": string;
        };
        "updateBingo": {
            "bingoNotFound": string;
            "bingoNotPending": string;
            "notAuthorized": string;
        };
        "deleteBingo": {
            "bingoNotFound": string;
            "notAuthorized": string;
        };
        "cancelBingo": {
            "bingoNotFound": string;
            "notAuthorized": string;
            "alreadyEndedOrCanceled": string;
        };
        "searchBingoActivities": {
            "bingoNotFound": string;
        };
        "formatBingoActivities": {
            "title": string;
        };
        "activityActions": {
            "created": string;
        };
    };
    "email": {
        "verificationEmail": {
            "subject": string;
            "body": string;
            "cta": string;
        };
    };
    "general": {
        "language": {
            "en": string;
            "fr": string;
        };
    };
    "session": {
        "createSessionForUser": {
            "userDisabled": string;
        };
    };
    "user": {
        "createUser": {
            "emailAlreadyExists": string;
            "usernameAlreadyExists": string;
        };
        "findByUsername": {
            "notFound": string;
        };
        "searchUsers": {
            "invalidStatus": string;
        };
        "searchUserActivities": {
            "userNotFound": string;
        };
        "updateUser": {
            "userNotFound": string;
            "usernameAlreadyExists": string;
        };
        "formatUserActivities": {
            "userNotFound": string;
        };
        "activity": {
            "created": {
                "title": {
                    "self": string;
                    "other": string;
                };
            };
            "updated": {
                "title": {
                    "self": string;
                    "other": string;
                };
                "body": {
                    "username": string;
                    "language": string;
                    "role": string;
                };
            };
        };
    };
    "validation": {
        "notEmpty": string;
        "invalidEmail": string;
        "username": {
            "noSpecialCharacters": string;
            "invalidLength": string;
        };
    };
};
/* prettier-ignore */
export type I18nPath = Path<I18nTranslations>;
