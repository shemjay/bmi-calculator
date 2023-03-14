const express =require('express');
const app=express();
const port= process.env.PORT||3000;
const bodyparser= require('body-parser');
const urlEncodedParser=bodyparser.urlencoded({extended:false})
const fs = require('fs');

app.set('views', 'views');
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '../public'));

const cal_bmi=(bmi)=>{
    if (bmi < 18.6) {
        return 'UnderWeight'
    }else if (bmi >= 18.6 && bmi < 24.9){
        return "Normal"
    }else{
        return "Overweight"
    }
}

app.get('/',(req,res)=>{
    res.render('home', {name:'John Doe'})
});

app.get('/contacts',(req,res)=>{
    res.render('contact')
})

app.post('/process_contacts',urlEncodedParser,(req,res)=>{
    res.end(`Thank you ${req.body.first_name} ${req.body.last_name}`)
});

app.get('/bmi',(req,res)=>{
    res.render('bmi')
})
app.post('/bmi',urlEncodedParser,(req,res)=>{
    const weight=req.body.weight;
    const height=req.body.height;
    const bmi= weight/(height*height)

    const reports = JSON.parse(fs.readFileSync('reports.json'));
    reports.push(bmi);
    fs.writeFileSync('reports.json', JSON.stringify(reports));
    const level=cal_bmi(bmi) 
    res.render('results', {bmi:bmi,level:level})
});

app.get('/reports',(req,res)=>{
    const reports = JSON.parse(fs.readFileSync('reports.json'));
    let sum=0
    reports.forEach(element => {
        sum+=element;
    });
    const avg=sum/reports.length;
    console.log(avg)
    const level=cal_bmi(avg)
    res.render('reports',{bmi:reports,avg:avg,level:level})
})

console.log(`server is listening on port ${port}`)
app.listen(port);