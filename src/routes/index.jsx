import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/main-layout";
import MailMergeTool from "../pages/MailMergeTool";
import MailSplitTool from "../pages/MailSplitTool";
import MailDuplicateTool from "../pages/MailDuplicateTool";
import MailDeDuplicationTool from "../pages/MailDeDuplicationTool";
import MailFormattedTool from "../pages/MailFormattedTool";

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
            },
            {
                path: "/mail-duplicate",
                element: <MailDuplicateTool />,
            },
            {
                path: "/mail-deduplicate",
                element: <MailDeDuplicationTool />
            },
            {
                path: "/mail-formatted",
                element: <MailFormattedTool />,
            },
            {
                path: "*",
                element: <h1>404 Not Found</h1>,
            }
        ]
    },

]);

export default routes;

