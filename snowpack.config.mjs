export default { 
    mount : {
        dist: '/',
        src: '/',
    },
    buildOptions: {
        out: '/dist',
        clean: true,
    },
    devOptions: {
        open: 'heim.html'
    },
    optimize :{
        bundle: true,
        minify: true,
        target: 'es2020', 
    }
}