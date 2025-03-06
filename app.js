const express = require('express');
const app = express();
const port = 3002;
const path = require('path');


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Menggunakan middleware untuk melayani file statis
app.use(express.static(path.join(__dirname, 'public')));



app.get('/', (req, res) => {
    const portfolioData = [
    {
        id: 1,
        image: "portfolio-item-01.jpg",
        category: "programming",
        title: "Website design for Rainy Design",
        modalImage: "portfolio_large_1.jpg",
        description: "A comprehensive website redesign project that focused on improving user experience and modernizing the visual aesthetic. The project included responsive design implementation and performance optimization.",
        projectType: "Web Development",
        client: "Rainy Design Studio",
        duration: "6 Weeks",
        tasks: "UI/UX, Frontend Development",
        budget: "$5000"
    },
    {
        id: 2,
        image: "portfolio-item-02.jpg",
        category: "development",
        title: "E-commerce Mobile App",
        modalImage: "portfolio_large_2.jpg",
        description: "A full-featured e-commerce mobile application supporting both iOS and Android platforms. Includes features like user authentication, product catalog, shopping cart, and secure payment integration.",
        projectType: "Mobile Development",
        client: "Shop Smart Inc",
        duration: "12 Weeks",
        tasks: "Mobile Development, API Integration",
        budget: "$12000"
    },
];



    res.render('index', {
                portfolioData
            });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
