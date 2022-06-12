package eus.ecrop.ui.controller;

import java.net.HttpCookie;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;

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
            @RequestHeader Map<String, String> headers) {
        String cookieHeader = request.getHeader("cookie");
        if (cookieHeader != null) {
            Arrays.stream(cookieHeader.split(" ")).forEach(cookieStr -> {
                List<HttpCookie> cookies = HttpCookie.parse(cookieStr);
                HttpCookie cookie = cookies.get(0);
                if (cookie.getName().equals("access_token")) {
                    response.addHeader("Set-Cookie",
                            "access_token=" + cookie.getValue() + "; expires="
                                    + new Date(System.currentTimeMillis() + 1000 * 60 * 60) + "; Path=/;");
                } else if (cookie.getName().equals("access_token")) {
                    response.addHeader("Set-Cookie",
                            "refresh_token=" + cookie.getValue() + "; expires="
                                    + new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24) + "; Path=/;");
                }
            });

        }
        return "forward:/";

    }

}