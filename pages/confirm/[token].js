import Head from "next/head";
import axios from "axios";
import { useRouter } from 'next/router';
import styles from "../../styles/Pincode.module.css";
import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { parseCookies, setCookie, destroyCookie } from 'nookies'

function Pincode() {
    const [pincode, setPincode] = useState("");
    const [pincodeArray, setPincodeArray] = useState([]);
    const router = useRouter();
    const token = router.query.token;
    const [isError, setIsError] = useState(false);

    const handlePincode = (pin) => {
        if (!isError) {
            let _pincode = pincode + pin
            pincodeArray.push(pin);
            console.log(pincodeArray);
            setPincode(_pincode);
            if (_pincode.length === 6) {
                let data = {
                    pincode: _pincode
                }
                axios.post(`${process.env.NEXT_PUBLIC_URL}api/v1/food/user/confirm`, data, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }).then(res => {
                    setCookie(null, 'userId', res.data.data.id, { path: '/' })
                    setCookie(null, 'name', res.data.data.name, { path: '/' })
                    setCookie(null, 'image', res.data.data.image, { path: '/' })
                    setCookie(null, 'isfirstLogin', res.data.data.isfirstLogin, { path: '/' })
                    router.replace('/');
                }).catch(err => {
                    console.log(err);
                    setIsError(true);
                    setPincodeArray([]);
                    setPincode("");
                })
            }
        }
    }
    return (
        <div>
            <Head>
                <title>Pincode</title>
            </Head>
            <div className={styles.layout}>
                <h2>{isError ? 'ลองใหม่อีกครั้ง' : 'ยืนยัน Pincode ของคุณ'}</h2>

                <div className={isError ? styles.view_shake : styles.view_otp} onAnimationEnd={
                    () => {
                        setTimeout(() => {
                            setIsError(false);
                        }, 1000)
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