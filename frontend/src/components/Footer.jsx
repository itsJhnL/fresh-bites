import LocationOnIcon from "@mui/icons-material/LocationOn";
import CallIcon from "@mui/icons-material/Call";
import AttachEmailIcon from "@mui/icons-material/AttachEmail";
import FacebookIcon from "@mui/icons-material/Facebook";
// import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";

export default function Footer() {
  return (
    <div className="bg-[#FFF] border-t-4">
      <div className="max-w-6xl mx-auto py-20 px-5">
        <div className="grid lg:grid-cols-5 sm:grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 lg:col-span-2">
            {/* <img src={Logo} alt="" /> */}
            <h1 className="Pacifico font-normal text-[#00213F] text-4xl">
              Fresh Bites
            </h1>
            <div>
              <div className="space-y-2 text-gray-700">
                <div className="flex hover:text-[#FF785B]">
                  <i>
                    <LocationOnIcon />
                  </i>
                  <span className="pl-3">
                    <a
                      href="https://www.google.com/search?q=nueva+ecija+philippines&oq=Nueva+Ecija+Philippines"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Nueva Ecija, Philippines
                    </a>
                  </span>
                </div>
                <div className="flex hover:text-[#FF785B]">
                  <i>
                    <CallIcon />
                  </i>
                  <span className="pl-3">
                    <a href="tel:+639123456789">+63 912 345 6789</a>
                  </span>
                </div>
                <div className="flex hover:text-[#FF785B]">
                  <i>
                    <AttachEmailIcon />
                  </i>
                  <span className="pl-3">
                    <a href="mailto:JanggoDev@gmail.com">info@fresbites.com</a>
                  </span>
                </div>
              </div>
            </div>
            {/* I need to think about */}
            {/* <div className="flex flex-col">
              <h1 className="text-base font-bold text-[#00213F] pt-5">
                Sign up to get 10% off your first order
              </h1>
              <form className="flex items-center justify-between pt-2">
                <input
                  type="email"
                  placeholder="Your Email Address"
                  className="border p-2 outline-none w-full"
                />
                <button className="hover:bg-[#E8FBFF] bg-[#FF785B] rounded-r-full text-white hover:text-[#00213F] p-2">
                  Subscribe
                </button>
              </form>
            </div> */}
          </div>
          <div>
            <h1 className="text-base font-bold pb-5 text-[#00213F]">
              Our Menu
            </h1>
            <div className="space-y-2 text-gray-700">
              <p className="cursor-pointer hover:text-[#FF785B]">Break Fast</p>
              <p className="cursor-pointer hover:text-[#FF785B]">Lunch</p>
              <p className="cursor-pointer hover:text-[#FF785B]">Dinner</p>
            </div>
          </div>
          <div>
            <h1 className="text-base font-bold pb-5 text-[#00213F]">
              Useful Links
            </h1>
            <div className="space-y-2 text-gray-700">
              <p className="cursor-pointer hover:text-[#FF785B]">
                <a href="/services">Services</a>
              </p>
              <p className="cursor-pointer hover:text-[#FF785B]"></p>
              <p className="cursor-pointer hover:text-[#FF785B]">
                <a href="/support">Help & Support</a>
              </p>
              <p className="cursor-pointer hover:text-[#FF785B]">
                <a href="/terms">Terms & Conditions</a>
              </p>
            </div>
          </div>
          <div>
            <h1 className="text-base font-bold pb-5 text-[#00213F]">Socials</h1>
            <ul className="flex flex-col space-y-2 text-gray-700">
              <li className="cursor-pointer hover:text-[#FF785B]">
                <FacebookIcon />
                <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="pl-3">
                  Facebook
                </a>
              </li>
              <li className="cursor-pointer hover:text-[#FF785B]">
                <TwitterIcon />
                <a href="https://x.com/" target="_blank" rel="noopener noreferrer" className="pl-3">
                  Twitter
                </a>
              </li>
              <li className="cursor-pointer hover:text-[#FF785B]">
                <YouTubeIcon />
                <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" className="pl-3">
                  YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center p-5 bg-[#F1F1F1] text-center">
        <p className="text-base">
          All Rights Reserved &copy; 2026 Copyright | Made by{" "}
          <a
            href="https://janggodev.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#435334]"
          >
            <b>JanggoDev</b>
          </a>
        </p>
      </div>
    </div>
  );
}
