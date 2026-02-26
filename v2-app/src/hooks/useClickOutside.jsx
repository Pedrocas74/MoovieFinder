import { useEffect } from "react";

export function useClickOutside(ref, callback) {  //to check if the user clicks inside a specific container 
                                                //in this case, the movieCard
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
}