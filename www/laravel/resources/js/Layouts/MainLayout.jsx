import {
    Box,
    Image,
    Flex,
    Spacer,
    Menu,
    Portal,
    Button,
    Center,
    Text,
    MenuList,
    MenuItem,
    MenuButton,
} from "@chakra-ui/react";
import { usePage, Link } from "@inertiajs/react";

const MainLayout = ({ children }) => {
    const { auth } = usePage().props;
    // const { isOpen, onOpen, onClose } = useDisclosure();
    // const btnRef = React.useRef();
    return (
        <div>
            {/* ヘッダー */}
            <Box
                background="green.900"
                width="100%"
                h="100px"
                pr="4"
                // color="white"
            >
                <Flex h="100%">
                    <Spacer />
                    <Center h="100%">
                        <Link href={route("post.index")}>
                            <Image
                                height="100px"
                                objectFit="contain"
                                src="../header_logo.png"
                                alt="logo"
                            />
                        </Link>
                    </Center>
                    <Spacer />
                    <Menu>
                        <MenuButton>
                            <Center h="100%">
                                <Box variant="outline" h="100%" size="sm">
                                    <Image
                                        height="100px"
                                        objectFit="contain"
                                        src="../user_icon.png"
                                        alt="logo"
                                    />
                                </Box>
                            </Center>
                        </MenuButton>
                        {auth.user ? (
                            <MenuList>
                                <MenuItem as="a" href={route("post.create")}>
                                    新規投稿
                                </MenuItem>
                                <MenuItem as="a" href={route("profile.edit")}>
                                    プロフィール
                                </MenuItem>
                                <MenuItem className="py-[4px] px-[8px] hover:bg-rose-300 text-m">
                                    <Link
                                        as="button"
                                        href={route("logout")}
                                        method="post"
                                    >
                                        ログアウト
                                    </Link>
                                </MenuItem>
                            </MenuList>
                        ) : (
                            <MenuList>
                                <MenuItem as="a" href={route("register")}>
                                    ユーザー登録
                                </MenuItem>
                                <MenuItem as="a" href={route("login")}>
                                    ログイン
                                </MenuItem>
                            </MenuList>
                        )}
                    </Menu>
                </Flex>
            </Box>

            {/* メイン */}
            <Box
                minH="100vh"
                bgImage={`url(../background_image.jpg)`}
                bgSize="cover"
                bgPosition="center"
                bgRepeat="no-repeat"
            >
                <Box w="90%" m="auto" py={10}>
                    {children}
                </Box>
            </Box>

            {/* フッター */}
            <Box
                background="green.900"
                width="100%"
                h="100px"
                padding="4"
                color="white"
            >
                <Flex h="100%">
                    <Center h="100%">
                        <Image
                            height="120%"
                            objectFit="contain"
                            src="../header_logo.png"
                            alt="logo"
                        />
                    </Center>
                    <Spacer />
                    <Center h="100%">
                        <Text textStyle="xl">©︎ 2025 蕎麦日和</Text>
                    </Center>
                </Flex>
            </Box>
        </div>
    );
};

export default MainLayout;
