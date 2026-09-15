import Header from "./Header";

const MainArea = ({ children }) => {
    return (
        <main className="main-area">
            <Header />
            {children}
        </main>
    );
};

export default MainArea;