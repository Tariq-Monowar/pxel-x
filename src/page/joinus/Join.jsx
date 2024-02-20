import "./join.css";
import React, { useState } from "react";
import "swiper/css";
import "swiper/css/effect-cards";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards } from "swiper/modules";
import Login from "./Login";
import Signup from "./Signup";

const Join = () => {
  const [textChanage, setTextChanage] = useState(false);
  const handleSlideChange = (swiper) => {
    console.log(swiper.activeIndex);
    if (swiper.activeIndex === 1) {
      setTextChanage(true);
    }
    if (swiper.activeIndex === 0) {
      setTextChanage(false);
    }
  };
  return (
    <>
      <div className="join">
        <div className="joinusform">
          <Swiper
            effect={"cards"}
            grabCursor={true}
            modules={[EffectCards]}
            className="mySwiper"
            onSlideChange={handleSlideChange}
          >
            <SwiperSlide>
              <Login />
            </SwiperSlide>

            <SwiperSlide>
              <Signup />
            </SwiperSlide>
          </Swiper>
        </div>

        <div className="othersign">
          {textChanage ? (
            <div className="signuptetx">
              <h1>Signup</h1>
              <p>
                Welcome to Pxel-X, where every image tells a unique story!.
                Ready to unleash your creativity and share your visual
                masterpieces with the world? Join Pxel-X, the ultimate hub for
                image sharing!.
              </p>
            </div>
          ) : (
            <div className="logintetx">
              <h1>Login</h1>
              <p>
                Welcome back to Pxel-X, where your visual journey continues!
                Ready to dive back into the world of pixel-perfect moments? Log
                in now to reconnect with your creative space.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Join;
