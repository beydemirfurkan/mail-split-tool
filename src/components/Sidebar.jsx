import { Link } from 'react-router-dom';

const sidebarItems = [
    {
        name: 'E-posta Birleştirme',
        path: '/mail-merge',
    },
    {
        name: 'E-posta Ayırma',
        path: '/mail-split',
    },
];


const Sidebar = () => {
  return (
    <aside className="w-64 border-e flex h-screen flex-col justify-between overflow-y-auto" aria-label="Sidebar">
      <div className="overflow-y-auto py-4 px-3 bg-gray-50 rounded h-full">
        <span
        className=" flex justify-start px-6 items-center pt-4">
            <img src="/public/yasko-logo.png" alt="Yasko Logo" width={160} />
        </span>
        <ul className="space-y-2 mt-10">
            {
                sidebarItems.map((item, index) => {
                    return (
                        <li key={index}>
                            <Link to={item.path} className="flex items-center p-2 rounded-lg hover:bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
                                <span className="ml-3">{item.name}</span>
                            </Link>
                        </li>
                    )
                })
            }
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
