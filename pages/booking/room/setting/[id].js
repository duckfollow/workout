import Head from "next/head";
import Image from 'next/image';
import { useState } from 'react';
import axios from "axios";
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useRouter } from "next/router";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import styles from '../../../../styles/Profile.module.css'
import success from "../../../../public/96237-success.json";
import error from "../../../../public/90569-error.json";
import Lottie from "lottie-react";
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListSubheader from '@mui/material/ListSubheader';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const Setting = ({ data }) => {
    const [roomData, setRoomData] = useState(data);
    const [roomName, setRoomName] = useState(roomData.data.name);
    const [roomType, setRoomType] = useState(roomData.data.type);
    const [roomCapacity, setRoomCapacity] = useState(roomData.data.capacity);
    const [roomPrice, setRoomPrice] = useState(roomData.data.price);
    const [roomDescription, setRoomDescription] = useState(roomData.data.description);
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [open, setOpen] = useState(false);
    const [idDelete, setIdDelete] = useState(null);
    const router = useRouter();
    const { id } = router.query;
    const upload = (event) => {
        let reader = new FileReader();
        const files = event.target.files[0];
        reader.onloadend = () => {
            let data = {
                "image": reader.result,
                "imageType": files.type,
                "room_id": id
            }
            axios.post(`${process.env.NEXT_PUBLIC_URL}api/v1/booking/room/image/upload`, data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            ).then(response => {
                console.log(response)
                readRoom()
            }
            ).catch(error => {
                console.log(error)
            })
        }
        reader.readAsDataURL(files)
    }

    //update room
    const updateRoom = () => {
        let data = {
            "id": id,
            "name": roomName,
            "type": roomType,
            "capacity": roomCapacity,
            "price": roomPrice,
            "description": roomDescription
        }
        axios.post(`${process.env.NEXT_PUBLIC_URL}api/v1/booking/room/update`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            console.log(response)
            readRoom()
        }).catch(error => {
            console.log(error)
        })
    }

    //read room by id
    const readRoom = () => {
        axios.get(`${process.env.NEXT_PUBLIC_URL}api/v1/booking/room/${id}`).then(response => {
            setRoomData(response.data)
            setLoading(true)
            setIsSuccess(true)
        }).catch(error => {
            console.log(error)
            setLoading(true)
            setIsSuccess(false)
        })
    }

    //delete room image by id
    const deleteRoomImage = () => {
        setOpen(false)
        axios.post(`${process.env.NEXT_PUBLIC_URL}api/v1/booking/room/image/delete`, {
            "id": idDelete
        }).then(response => {
            console.log(response)
            readRoom()
        }).catch(error => {
            console.log(error)
        })
    }

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <div style={
            {
                padding: '20px',
                marginBottom: '20px',
            }
        }>
            <Head>
                <title>Setting</title>
            </Head>
            <h1>Setting</h1>
            <Box>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4} order={{ xs: 2, md: 1 }}>
                        <Stack direction="column" spacing={2}>
                            <TextField id="outlined-basic" inputProps={{ maxLength: 4, pattern: "[a-zA-Z0-9]" }} value={roomName} label="รหัสห้อง" variant="outlined" onChange={
                                (event) => {
                                    setRoomName(event.target.value)
                                }
                            } />
                            {/* <TextField id="outlined-basic" label="ชื่อห้อง" variant="outlined" /> */}
                            <TextField id="outlined-basic" label="ประเภท" variant="outlined" value={roomType} onChange={
                                (event) => {
                                    setRoomType(event.target.value)
                                }
                            } />
                            <TextField id="outlined-basic" label="ความจุ" variant="outlined" value={roomCapacity} onChange={
                                (event) => {
                                    setRoomCapacity(event.target.value)
                                }
                            } />
                            <TextField id="outlined-basic" label="ราคา" variant="outlined" value={roomPrice} onChange={
                                (event) => {
                                    setRoomPrice(event.target.value)
                                }
                            } />
                            <TextField id="outlined-basic" label="รายละเอียด" variant="outlined" value={roomDescription} onChange={
                                (event) => {
                                    setRoomDescription(event.target.value)
                                }
                            } />
                            <Stack direction='row' spacing={2}>
                                <Button fullWidth size='large' variant="outlined" color="primary">
                                    ยกเลิก
                                </Button>
                                <Button fullWidth size='large' variant="contained" color="primary" onClick={updateRoom}>
                                    บันทึก
                                </Button>
                            </Stack>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={8} order={{ xs: 1, md: 2 }}>
                        <Stack direction="row" spacing={2}>
                            <Button startIcon={<PhotoCamera />} variant="contained" component="label">
                                Upload
                                <input hidden accept="image/*" multiple type="file" onChange={upload} />
                            </Button>
                            {/* <IconButton color="primary" aria-label="upload picture" component="label">
                                <input hidden accept="image/*" type="file" />
                                <PhotoCamera />
                            </IconButton> */}
                        </Stack>
                        <ImageList
                            sx={{ width: 350, height: 'auto' }}
                            md={{ width: 1200, height: 'auto' }}
                            variant="quilted"
                            rowHeight={121}
                        >
                            {
                                roomData.data.booking_room_images.map((image, index) => {
                                    return (
                                        <ImageListItem key={image.id}>
                                            <img src={image.imageURL} loading="lazy" />
                                            <ImageListItemBar
                                                actionIcon={
                                                    <IconButton
                                                        sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                                                        aria-label={`info about ${image.id}`}
                                                        onClick={() => { setOpen(true); setIdDelete(image.id) }}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                }
                                            />
                                        </ImageListItem>
                                    )
                                })
                            }
                        </ImageList>
                    </Grid>
                </Grid>
            </Box>
            <Dialog
                open={open}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{`คุณต้องการลบรายการนี้ใช่หรือไม่?`}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        คุณจะไม่สามารถกู้คืนรายการนี้ได้ id:{idDelete} หากคุณลบรายการนี้
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>ยกเลิก</Button>
                    <Button onClick={deleteRoomImage}>ลบ</Button>
                </DialogActions>
            </Dialog>
            {loading ?
                <div className={styles.loading} onClick={
                    () => {
                        setLoading(false)
                    }
                }>
                    <Lottie id='lottie' style={
                        {
                            width: '260px',
                            height: 'auto',
                        }
                    } animationData={isSuccess ? success : error} loop={true} onLoopComplete={
                        () => {
                            setLoading(false)
                        }
                    } />
                </div> : null
            }
        </div>
    );
}

export default Setting;

export async function getServerSideProps(context) {
    const cookies = context.req ? context.req.cookies : '';
    const userId = cookies.userId !== undefined ? cookies.userId : process.env.NEXT_PUBLIC_USER;
    const id = context.query.id
    const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}api/v1/booking/room/${id}`)
    const data = await res.data
    return {
        props: {
            data
        }
    }
}