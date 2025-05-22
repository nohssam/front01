import { useParams } from "react-router-dom"

export default function ProductDetail(){
    const {id} = useParams();
    
    return(
        <div>
            상품 상세 보기 : {id}
        </div>
    )
}