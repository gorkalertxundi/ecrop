package eus.ecrop.ui.controller;

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
        return "forward:/";
    }

}