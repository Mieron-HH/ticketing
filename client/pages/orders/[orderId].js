import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/use-request";
import Router from "next/router";

const OrderShow = ({ order, currentUser }) => {
        const [timeLeft, setTimeLeft] = useState(0);
        const { doRequest, errors } = useRequest({
                url: "/api/payments",
                method: "post",
                body: {
                        orderId: order.id,
                },
                onSuccess: (payment) => Router.push("/orders"),
        });

        useEffect(() => {
                const findTimeLeft = () => {
                        const msLeft = new Date(order.expiresAt) - new Date();
                        setTimeLeft(Math.round(msLeft / 1000));
                };
                
                findTimeLeft();
                const timerId = setInterval(findTimeLeft, 1000);
                
                return () => {
                        clearInterval(timerId);
                };
        }, [order]);       

        if (timeLeft < 0) {
                return <div>Order Expired</div>;
        }

        return <div>
                Time left to pay: {timeLeft} seconds
                <br />
                <StripeCheckout stripeKey="pk_test_51L0XVDEEJz20M4jpvjO6M3Hjei3Bb6w48Ru3eTJnVR5nSN19ibjPrx1ABLwhpTZ1XOzSxhw54oGWzhNCsdKF6q8g00LmXNX4jK" currency="USD" amount={parseFloat(order.ticket.price) * 100} email={currentUser.email} token={({ id }) => doRequest({ token: id })} />
                {errors}
        </div>;
};

OrderShow.getInitialProps = async (context, client) => {
        const { orderId } = context.query;
        const { data } = await client.get(`/api/orders/${orderId}`);

        return { order: data };
}

export default OrderShow;