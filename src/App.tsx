import { BrowserRouter } from "react-router";
import AllRoutes from "./presentation/AllRoutes";
export default function App() {
	return (
		<BrowserRouter>
			<AllRoutes />
		</BrowserRouter>
	);
}
