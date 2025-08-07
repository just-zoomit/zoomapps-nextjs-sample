```
{
    "manifest": {
        "display_information": {
            "display_name": "Zoom App Next.js Sample App"
        },
        "oauth_information": {
            "usage": "USER_OPERATION",
            "development_redirect_uri": "https://donte.ngrok.io/auth/callback",
            "production_redirect_uri": "",
            "oauth_allow_list": [
                "https://donte.ngrok.io/auth/callback",
                "https://oauth.pstmn.io/v1/callback"
            ],
            "strict_mode": false,
            "subdomain_strict_mode": false,
            "scopes": [
                
                {
                    "scope": "zoomapp:inmeeting",
                    "optional": false
                },
                {
                    "scope": "marketplace:read:app",
                    "optional": false
                },
                {
                    "scope": "user:read:user",
                    "optional": false
                }
            ]
        },
        "features": {
            "products": [
                "ZOOM_MEETING"
            ],
            "development_home_uri": "https://donte.ngrok.io",
            "production_home_uri": "",
            "domain_allow_list": [
                {
                    "domain": "appssdk.zoom.us",
                    "explanation": ""
                },
                {
                    "domain": "ngrok.io",
                    "explanation": ""
                }
            ],
            "in_client_feature": {
                "zoom_app_api": {
                    "enable": false,
                    "zoom_app_apis": []
                },
                "guest_mode": {
                    "enable": false,
                    "enable_test_guest_mode": false
                },
                "in_client_oauth": {
                    "enable": false
                },
                "collaborate_mode": {
                    "enable": false,
                    "enable_screen_sharing": false,
                    "enable_play_together": false,
                    "enable_start_immediately": false,
                    "enable_join_immediately": false
                }
            },
            "zoom_client_support": {
                "mobile": {
                    "enable": false
                },
                "zoom_room": {
                    "enable": false,
                    "enable_personal_zoom_room": false,
                    "enable_shared_zoom_room": false,
                    "enable_digital_signage": false,
                    "enable_zoom_rooms_controller": false
                },
                "pwa_client": {
                    "enable": false
                }
            },
            "embed": {
                "meeting_sdk": {
                    "enable": false,
                    "enable_device": false,
                    "devices": []
                },
                "contact_center_sdk": {
                    "enable": false
                },
                "phone_sdk": {
                    "enable": false
                }
            },
            "team_chat_subscription": {
                "enable": false,
                "enable_support_channel": false,
                "shortcuts": []
            },
            "event_subscription": {
                "enable": true,
                "events": [                   
                ]
            }
        }
    }
}
```