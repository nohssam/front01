import { Divider, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { makeupApi } from "../api/http";
import { Link } from "react-router-dom";
import '../styles/main.css'
export default function Main(){
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 외부 정보 호출 (API 호출)
    const getData = async () => {
        try {
            setLoading(true);
            const response = await makeupApi.get('/v1/products.json?brand=maybelline');
            // console.log(response);
            setList(response.data.slice(0,12)); // 상위 12개
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally{
            setLoading(false);
        }
    };
    useEffect(()=>{
       getData();
    },[]);

    // 로딩 또는 에러처리
    if(loading) return <div style={{textAlign:"center", padding:"20px"}}>로딩 중....</div>
    if(error) return <div style={{textAlign:"center", padding:"20px"}}>Error:{error}</div>
    return(
        <div style={{width:"80%", margin:"0 auto", padding:"20px"}}>
            <h2 style={{textAlign:"center"}}>베스트 상품</h2>
            <Divider />
                <Grid container spacing={2} justifyContent="center">
                {list.map((k) => (
                    // 반응형 웹 : xs=모바일에서 전체차지, sm(small 화면 6간 = 태블릿에서 1줄에 2개, 
                    // md:데스크에서 1줄에 4개)
                    <Grid item xs={12} sm={6} md={3} key={k.id} style={{textAlign:"center"}}>
                        <Link to={`/productdetail/${k.id}`} style={{textDecoration:"none", color:"inherit"}}>
                        <img className="img_item" src={k.image_link} alt={k.name}  />
                        <strong style={{color:"blue"}}>{k.name}</strong>
                        <div className="txt_info">{k.category} &nbsp; {k.product_type}</div>
                        <strong className="num_price">${k.price}</strong>
                        </Link>
                    </Grid> 
                ))}
            </Grid>
        </div>
    )
}