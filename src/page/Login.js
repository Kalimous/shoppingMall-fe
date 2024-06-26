import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../action/userAction";
import userStore from "../store/userStore";
import errorStore from "../store/errorStore";
import { useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";

import "../style/login.style.css";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { user, loginUser, setUser, loginWithGoogle } = userStore();
    const { error, setError, clearError } = errorStore();

    useEffect(() => {
        clearError();
    }, []);

    const loginWithEmail = async (event) => {
        event.preventDefault();
        const response = await loginUser({ email, password }, navigate);
        console.log(response.status);
        if (response.status === 200) {
            const token = response.data.token;
            sessionStorage.setItem("token", token);
            setUser(response.data.user);
            setError("");
        } else {
            setError(response.message);
        }
    };

    const handleGoogleLogin = async (googleData) => {
        const response = loginWithGoogle(googleData.credential);
    };

    if (user) {
        navigate("/");
    }

    return (
        <>
            <Container className="login-area">
                {error && (
                    <div className="error-message">
                        <Alert variant="danger">{error}</Alert>
                    </div>
                )}
                <Form className="login-form" onSubmit={loginWithEmail}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            required
                            onChange={(event) => setEmail(event.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            required
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                        />
                    </Form.Group>
                    <div className="display-space-between login-button-area">
                        <Button variant="danger" type="submit">
                            Login
                        </Button>
                        <div>
                            아직 계정이 없으세요?
                            <Link to="/register">회원가입 하기</Link>{" "}
                        </div>
                    </div>

                    <div className="text-align-center mt-2">
                        <p>-외부 계정으로 로그인하기-</p>
                        <div className="display-center">
                            <GoogleLogin
                                onSuccess={(credentialResponse) => {
                                    handleGoogleLogin(credentialResponse);
                                }}
                                onError={() => {
                                    console.log("Login Failed");
                                }}
                            />
                            ;
                        </div>
                    </div>
                </Form>
            </Container>
        </>
    );
};

export default Login;
