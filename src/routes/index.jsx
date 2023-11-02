import { createBrowserRouter } from "react-router-dom";
import MailMergeTool from "../pages/MailMergeTool";
import MailSplitTool from "../pages/MailSplitTool";
import MainLayout from "../layouts/main-layout";

const routes = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                path: "/mail-merge",
                element: <MailMergeTool />,
            },
            {
                path: "/mail-split",
                element: <MailSplitTool />,
            }
        ]
    },

]);

export default routes;

