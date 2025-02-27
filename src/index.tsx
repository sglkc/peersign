import { render } from 'preact'
import App from './App'
import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'

render(<App />, document.getElementById('app'))
