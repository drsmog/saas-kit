import { Button } from "@chakra-ui/button";

export default function UIButton(props) {
  return (
    <>
      {!props.type && (
        <Button
          backgroundColor="#EEF2F6"
          borderRadius="8px"
          color="#222222"
          fontWeight="600"
          fontSize={"16px"}
          _hover={{ backgroundColor: "#dee4e9" }}
          _active={{ backgroundColor: "#dee4e9" }}
          _focus={{ outline: "unset" }}
          {...props}
        >
          {props.children}
        </Button>
      )}
      {props.type == "special1" && (
        <Button
          backgroundColor="#FC8F36"
          borderRadius="8px"
          color="#FFFFFF"
          fontWeight={600}
          fontSize={"16px"}
          _hover={{ backgroundColor: "#c44f2a" }}
          _active={{ backgroundColor: "#c44f2a" }}
          _focus={{ outline: "unset" }}
          {...props}
        >
          {props.children}
        </Button>
      )}
      {props.type == "special2" && (
        <Button
          backgroundColor="#FFE2C9"
          borderRadius="8px"
          color="#000000"
          fontWeight={600}
          fontSize={"16px"}
          _hover={{ backgroundColor: "#F7CFAE" }}
          _active={{ backgroundColor: "#F7CFAE" }}
          _focus={{ outline: "unset" }}
          boxShadow=" 4px 4px 4px rgba(0, 0, 0, 0.25)"
          {...props}
        >
          {props.children}
        </Button>
      )}
      {props.type == "special3" && (
        <Button
          background="linear-gradient(93.19deg, #EE8232 0.78%, #E6A23A 100%);"
          border={"1px solid #ACACAC"}
          boxShadow=" 2px 4px 6px rgba(0, 0, 0, 0.3)"
          borderRadius="12px"
          color="#FFFFFF"
          fontWeight={600}
          fontSize={"16px"}
          _hover={{
            background:
              "linear-gradient(93.19deg, #d08146 100%, #d08146 100%);",
          }}
          _active={{
            background: " #d08146",
          }}
          _focus={{ outline: "unset" }}
          {...props}
        >
          {props.children}
        </Button>
      )}
      {props.type == "special4" && (
        <Button
          background="#FFEECB"
          border={"1px solid #ACACAC"}
          boxShadow=" 2px 4px 6px rgba(0, 0, 0, 0.3)"
          borderRadius="12px"
          color="#333333"
          fontWeight={600}
          fontSize={"20px"}
          _hover={{ backgroundColor: "#dccba7" }}
          _active={{ backgroundColor: "#dccba7" }}
          _focus={{ outline: "unset" }}
          {...props}
        >
          {props.children}
        </Button>
      )}
      {props.type == "special4-selected" && (
        <Button
          background="#FFEECB"
          border={"2px solid orange"}
          boxShadow=" 2px 4px 6px rgba(0, 0, 0, 0.3)"
          borderRadius="12px"
          color="#333333"
          fontWeight={600}
          fontSize={"20px"}
          _hover={{ backgroundColor: "#dccba7" }}
          _active={{ backgroundColor: "#dccba7" }}
          _focus={{ outline: "unset" }}
          {...props}
        >
          {props.children}
        </Button>
      )}
      {props.type == "special5" && (
        <Button
          background="#DCEBFF"
          border={"1px solid #ACACAC"}
          boxShadow=" 2px 4px 6px rgba(0, 0, 0, 0.3)"
          borderRadius="12px"
          color="#333333"
          fontWeight={600}
          fontSize={"20px"}
          _hover={{ backgroundColor: "#b9c9de" }}
          _active={{ backgroundColor: "#b9c9de" }}
          _focus={{ outline: "unset" }}
          {...props}
        >
          {props.children}
        </Button>
      )}
      {props.type == "special6" && (
        <Button
          backgroundColor={"unset"}
          border={"1px solid #EE8433"}
          boxShadow=" 2px 4px 6px rgba(0, 0, 0, 0.3)"
          borderRadius="12px"
          color="#EE8433"
          fontWeight={600}
          fontSize={"20px"}
          _hover={{ backgroundColor: "#b9c9de" }}
          _active={{ backgroundColor: "#b9c9de" }}
          _focus={{ outline: "unset" }}
          {...props}
        >
          {props.children}
        </Button>
      )}
      {props.type == "special7" && (
        <Button
          // backgroundColor={"unset"}
          colorScheme={"red"}
          border={"1px solid #EE8433"}
          boxShadow=" 2px 4px 6px rgba(0, 0, 0, 0.3)"
          borderRadius="12px"
          // color="#EE8433"
          fontWeight={600}
          fontSize={"20px"}
          // _hover={{ backgroundColor: "#b9c9de" }}
          // _active={{ backgroundColor: "#b9c9de" }}
          _focus={{ outline: "unset" }}
          {...props}
        >
          {props.children}
        </Button>
      )}
      {props.type == "primary" && (
        <Button
          backgroundColor="#BD5323"
          borderRadius="8px"
          color="#FFFFFF"
          fontWeight={600}
          fontSize={"16px"}
          _hover={{ backgroundColor: "#c44f2a" }}
          _active={{ backgroundColor: "#c44f2a" }}
          _focus={{ outline: "unset" }}
          {...props}
        >
          {props.children}
        </Button>
      )}
      {props.type === "secondary" && (
        <Button
          background="#9BCDFA"
          border="solid 1px #929292"
          borderRadius="8px"
          color="black"
          fontWeight="600"
          fontSize={"18px"}
          _hover={{ backgroundColor: "#69afed" }}
          _active={{ backgroundColor: "#69afed" }}
          _focus={{ outline: "unset" }}
          {...props}
        >
          {props.children}
        </Button>
      )}
    </>
  );
}
