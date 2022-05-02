package eus.ecrop.ui.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class UIController {
    
    @GetMapping("/login")
    public String login() {
        return "<h1>h33h33</h1>";
    }

}
