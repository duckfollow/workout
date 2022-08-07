import dynamic from 'next/dynamic'
const AppBar = dynamic(() => import('./AppBar'), { ssr: false })

module.exports = {
    AppBar
}