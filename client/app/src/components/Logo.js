import { ReactComponent as LogoO1 } from '../assets/logo_o1.svg'
import { ReactComponent as LogoO2 } from '../assets/logo_o2.svg'

const Logo = () => {
    return (
        <div className='m-auto flex flex-row justify-center items-center'>
          <p className='mx-0 w-12 h-12 text-center text-white font-sans text-5xl'>M</p>
          <LogoO1 className='w-12 h-12 mx-1'/>
          <LogoO2 className='w-12 h-12 mx-1'/>
          <p className='mx-0 w-12 h-12 text-center text-white font-sans text-5xl'>D</p>
        </div>
    );  
}

export default Logo