package eus.ecrop.ui.controller;

import java.util.Date;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

/*
* @author Mikel Orobengoa
* @version 31/05/2022
*/

/**
 * It's a controller that returns the viewport modules.
 */
@Controller
@RequestMapping("/auth")
public class AuthController {

    @GetMapping("/cookies")
    public String setCookies(HttpServletRequest request, HttpServletResponse response,
            @RequestParam("access_token") String accessToken, @RequestParam("refresh_token") String refreshToken) {

        Date accessTokenExpiration = new Date(System.currentTimeMillis() + 1000 * 60 * 60);

        response.addHeader("Set-Cookie",
                "access_token=" + accessToken + "; expires=" + accessTokenExpiration + "; Path=/;");

        Date refreshTokenExpiration = new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24);

        response.addHeader("Set-Cookie",
                "refresh_token=" + refreshToken + "; expires=" + refreshTokenExpiration + "; Path=/;");

        return "forward:/";
    }

}