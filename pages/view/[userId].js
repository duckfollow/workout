import Head from "next/head";
import axios from "axios";
import Image from "next/image";
import styles from '../../styles/Profile.module.css'
import Grid from '@mui/material/Grid';
const View = ({ data, userId }) => {
    return (
        <div style={
            {
                padding: '20px',
            }
        }>
            <Head>
                <title>View</title>
            </Head>
            {
                data.data.recommend.length > 0 ?
                    <div>
                        <h1>Recommend</h1>
                        <div className={styles.grid_product}>
                            {
                                data.data.recommend.map((item, index) => {
                                    return (
                                        <div className={styles.card} key={item.productId}>
                                            <div className={styles.view_table}>
                                                <div className={styles.text} style={
                                                    {
                                                        width: '50%',
                                                    }
                                                }>
                                                    <span
                                                        style={
                                                            {
                                                                fontSize: '20px',
                                                            }
                                                        }>{item.name}</span>
                                                    <span
                                                        style={{
                                                            fontSize: '20px',
                                                        }}>{item.price.toLocaleString('th-TH', { style: 'currency', currency: 'THB' })}</span>
                                                    <span
                                                        style={
                                                            {
                                                                fontSize: '12px',
                                                            }
                                                        }>
                                                    </span>
                                                </div>
                                                <div className={styles.table} style={
                                                    {
                                                        width: '50%',
                                                    }
                                                }>
                                                    <Image src={item.image} alt={''} width={150} height={150} objectFit='contain' />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div> : null}

            <Grid container spacing={2}>
                {/* <Grid item xs={12} md={3}>
                </Grid> */}
                <Grid item xs={12} md={4} style={{
                    display: data.data.product.foods.length > 0 ? 'block' : 'none'
                }}>
                    <h2>อาหารจานหลัก</h2>
                    <div className={styles.grid_product}>
                        {
                            data.data.product.foods.map((item, index) => {
                                return (
                                    <div className={styles.card} key={item.productId}>
                                        <div className={styles.view_table}>
                                            <div className={styles.text} style={
                                                {
                                                    width: '50%',
                                                }
                                            }>
                                                <span
                                                    style={
                                                        {
                                                            fontSize: '20px',
                                                        }
                                                    }>{item.name}</span>
                                                <span
                                                    style={{
                                                        fontSize: '20px',
                                                    }}>{item.price.toLocaleString('th-TH', { style: 'currency', currency: 'THB' })}</span>
                                                <span
                                                    style={
                                                        {
                                                            fontSize: '12px',
                                                        }
                                                    }>
                                                </span>
                                            </div>
                                            <div className={styles.table} style={
                                                {
                                                    width: '50%',
                                                }
                                            }>
                                                <Image src={item.image} alt={''} width={150} height={150} objectFit='contain' />
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </Grid>
                <Grid item xs={12} md={4} style={{
                    display: data.data.product.drinks.length > 0 ? 'block' : 'none'
                }}>
                    <h2>เครื่องดื่ม</h2>
                    <div className={styles.grid_product}>
                        {
                            data.data.product.drinks.map((item, index) => {
                                return (
                                    <div className={styles.card} key={item.productId}>
                                        <div className={styles.view_table}>
                                            <div className={styles.text} style={
                                                {
                                                    width: '50%',
                                                }
                                            }>
                                                <span
                                                    style={
                                                        {
                                                            fontSize: '20px',
                                                        }
                                                    }>{item.name}</span>
                                                <span
                                                    style={{
                                                        fontSize: '20px',
                                                    }}>{item.price.toLocaleString('th-TH', { style: 'currency', currency: 'THB' })}</span>
                                                <span
                                                    style={
                                                        {
                                                            fontSize: '12px',
                                                        }
                                                    }>
                                                </span>
                                            </div>
                                            <div className={styles.table} style={
                                                {
                                                    width: '50%',
                                                }
                                            }>
                                                <Image src={item.image} alt={''} width={150} height={150} objectFit='contain' />
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </Grid>
                <Grid item xs={12} md={4} style={{
                    display: data.data.product.sweets.length > 0 ? 'block' : 'none'
                }}>
                    <h2>ของหวาน</h2>
                    <div className={styles.grid_product}>
                        {
                            data.data.product.sweets.map((item, index) => {
                                return (
                                    <div className={styles.card} key={item.productId}>
                                        <div className={styles.view_table}>
                                            <div className={styles.text} style={
                                                {
                                                    width: '50%',
                                                }
                                            }>
                                                <span
                                                    style={
                                                        {
                                                            fontSize: '20px',
                                                        }
                                                    }>{item.name}</span>
                                                <span
                                                    style={{
                                                        fontSize: '20px',
                                                    }}>{item.price.toLocaleString('th-TH', { style: 'currency', currency: 'THB' })}</span>
                                                <span
                                                    style={
                                                        {
                                                            fontSize: '12px',
                                                        }
                                                    }>
                                                </span>
                                            </div>
                                            <div className={styles.table} style={
                                                {
                                                    width: '50%',
                                                }
                                            }>
                                                <Image src={item.image} alt={''} width={150} height={150} objectFit='contain' />
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}

export const getServerSideProps = async (context) => {
    const { userId } = context.params;
    const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}api/v1/food/view/menu/${userId}`);
    const data = await res.data
    return {
        props: {
            data,
            userId
        }
    }
}

export default View;