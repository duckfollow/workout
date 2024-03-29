import Head from "next/head";
import axios from "axios";
import { useRouter } from 'next/router';
import styles from "../../styles/Pincode.module.css";
import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { parseCookies, setCookie, destroyCookie } from 'nookies'

function Pincode() {
    const [pincode, setPincode] = useState("");
    const [pincodeConfirmed, setPincodeConfirmed] = useState("");
    const [pincodeState, setPincodeState] = useState("NewPin");
    const [pincodeArray, setPincodeArray] = useState([]);
    const [isError, setIsError] = useState(false);
    const router = useRouter();
    const token = router.query.token;

    const handlePincode = (pin) => {
        if (!isError) {
            if (pincodeState === "NewPin") {
                let _pincode = pincode + pin
                pincodeArray.push(pin);
                setPincode(_pincode);
                if (_pincode.length === 6) {
                    setPincodeState("ConfirmPin");
                    setPincodeArray([]);
                }
            } else if (pincodeState === "ConfirmPin") {
                let _pincode = pincodeConfirmed + pin
                pincodeArray.push(pin);
                setPincodeConfirmed(_pincode);

                if (pincode.length === 6 && _pincode.length === 6) {
                    setPincodeState("Confirmed");
                    let data = {
                        pincode: pincode,
                        pincodeConfirmed: _pincode
                    }
                    axios.post(`${process.env.NEXT_PUBLIC_URL}api/v1/food/user/update`, data, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }).then(res => {
                        setCookie(null, 'userId', res.data.userId, { path: '/' })
                        setCookie(null, 'name', res.data.name, { path: '/' })
                        setCookie(null, 'image', res.data.image, { path: '/' })
                        setCookie(null, 'isfirstLogin', res.data.isfirstLogin, { path: '/' })
                        router.replace('/');
                    }).catch(err => {
                        console.log(err);
                        setPincodeState("NewPin");
                        setPincodeArray([]);
                        setIsError(true);
                        setPincode("");
                        setPincodeConfirmed("");
                    })
                }
            }
        }
    }
    return (
        <div>
            <Head>
                <title>Pincode</title>
                <link rel="icon" href="/logo-2.png" />
                <meta property="og:url" content="https://workout.duckfollow.co/" />
                <meta property="og:type" content="article" />
                <meta property="og:image:width" content="500" />
                <meta property="og:image:height" content="500" />
                <meta property="og:title" content="POS ออนไลน์" />
                <meta property="og:description" content="POS ออนไลน์" />
                <meta property="og:image" content="/thumbnail.png" />

                <meta name="twitter:title" content="POS ออนไลน์" />
                <meta name="twitter:description" content="POS ออนไลน์" />
                <meta name="twitter:image" content="/thumbnail.png" />
                <meta name="twitter:card" content="summary_large_image"></meta>

                <meta name="description" content="POS ออนไลน์" />
            </Head>
            <div className={styles.layout}>
                <h2>{pincodeState === "ConfirmPin" ? 'ยืนยัน Pincode ของคุณ' : isError ? 'ตั้งค่า Pincode ใหม่อีกครั้ง' : 'ตั้งค่า Pincode ของคุณ'}</h2>

                <div className={isError ? styles.view_shake : styles.view_otp} onAnimationEnd={
                    () => {
                        setTimeout(() => {
                            setIsError(false);
                        }, 1000);
                    }
                }>
                    <div className={pincodeArray[0] !== undefined ? styles.circle_hover : styles.circle}></div>
                    <div className={pincodeArray[1] !== undefined ? styles.circle_hover : styles.circle}></div>
                    <div className={pincodeArray[2] !== undefined ? styles.circle_hover : styles.circle}></div>
                    <div className={pincodeArray[3] !== undefined ? styles.circle_hover : styles.circle}></div>
                    <div className={pincodeArray[4] !== undefined ? styles.circle_hover : styles.circle}></div>
                    <div className={pincodeArray[5] !== undefined ? styles.circle_hover : styles.circle}></div>
                </div>

                <div className={styles.columns}>
                    <div className={styles.column}>
                        <Button className={styles.circle_btn} variant='outlined' onClick={(e) => {
                            handlePincode(1)
                        }}>1</Button>
                    </div>
                    <div className={styles.column}>
                        <Button className={styles.circle_btn} variant='outlined' onClick={(e) => {
                            handlePincode(2)
                        }}>2</Button>
                    </div>
                    <div className={styles.column}>
                        <Button className={styles.circle_btn} variant='outlined' onClick={(e) => {
                            handlePincode(3)
                        }}>3</Button>
                    </div>

                    <div className={styles.column}>
                        <Button className={styles.circle_btn} variant='outlined' onClick={(e) => {
                            handlePincode(4)
                        }}>4</Button>
                    </div>
                    <div className={styles.column}>
                        <Button className={styles.circle_btn} variant='outlined' onClick={(e) => {
                            handlePincode(5)
                        }}>5</Button>
                    </div>
                    <div className={styles.column}>
                        <Button className={styles.circle_btn} variant='outlined' onClick={(e) => {
                            handlePincode(6)
                        }}>6</Button>
                    </div>

                    <div className={styles.column}>
                        <Button className={styles.circle_btn} variant='outlined' onClick={(e) => {
                            handlePincode(7)
                        }}>7</Button>
                    </div>
                    <div className={styles.column}>
                        <Button className={styles.circle_btn} variant='outlined' onClick={(e) => {
                            handlePincode(8)
                        }}>8</Button>
                    </div>
                    <div className={styles.column}>
                        <Button className={styles.circle_btn} variant='outlined' onClick={(e) => {
                            handlePincode(9)
                        }}>9</Button>
                    </div>

                    <div className={styles.column}>

                    </div>
                    <div className={styles.column}>
                        <Button className={styles.circle_btn} variant='outlined' onClick={(e) => {
                            handlePincode(0)
                        }}>0</Button>
                    </div>
                    <div className={styles.column}>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Pincode;