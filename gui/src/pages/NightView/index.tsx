import Layout from "@/Layout";
import { useParams } from "react-router";

function NightView() {
  const { date } = useParams<{ date: string }>();
  return (
    <Layout>
      <div>night view goes here for {date}</div>
    </Layout>
  );
}

export default NightView;
