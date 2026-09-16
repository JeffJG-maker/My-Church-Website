import Header from "./Header";

const MainArea = ({ children }) => {
    return (
        <main className="main-area ml-65 p-5">
            <Header />
            {children}
        </main>
    );
};

export default MainArea;