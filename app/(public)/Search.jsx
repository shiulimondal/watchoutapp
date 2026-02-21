import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    KeyboardAvoidingView,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Colors from "../../constants/Colors";
import { Feather, Ionicons } from "@expo/vector-icons";
import BackNavigation from "../../components/BackNavigation";
import { useNavigation, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch, useSelector } from "react-redux";
import Assets from "../../components/Assets";
import HeadingLoader from "../../components/HeadingLoader";
import { getSearchResults } from "../../redux/features/SearchClice";
import { msToTime } from "../../util/Util";
import SkeletonLoading from 'expo-skeleton-loading';
import { getPopularShows } from "../../redux/features/home/PopularShowsSlice";
import { getJustAddedShows } from "../../redux/features/home/JustAddedShowsSlice";
import AssetsForSearch from "../../components/AssetsForSearch";
const { width, height } = Dimensions.get("window");

const Search = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { userData } = useSelector((state) => state.login);
    const signupData = useSelector((state) => state.account.data);
    const { data: forMobileData } = useSelector((state) => state.accountForPh);
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchedItems, setSearchedItems] = useState([]);
    const [filteredSearchedItems, setFilteredSearchedItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [popular, setPopular] = useState([]);
    const [justAdded, setJustAdded] = useState([]);

    const [filters, setFilters] = useState([
        { id: 1, title: "All", type: "all" },
        { id: 2, title: "Movies", type: "movie" },
        { id: 3, title: "Shows", type: "webseries" },
        { id: 4, title: "Comedy", type: "comedy" },
    ]);

    const { popular_data, popular_loading } = useSelector(
        (state) => state.popular
    );
    const { just_added_data, just_added_loading } = useSelector(
        (state) => state.justAdded
    );
    const [selectedFilter, setSelectedFilter] = useState("all");

    const [filterJustAdded, setFilterJustAdded] = useState(justAdded);

    const [filterPopular, setFilterPoular] = useState(popular);


    const [limit, setLimit] = useState(10);

    const [page, setPage] = useState(1);

    const { data, search_loading } = useSelector((state) => state.search);

    useEffect(() => {
        setSearchedItems(data);
        setFilteredSearchedItems(data);
    }, [data]);

    useEffect(() => {
        if (searchQuery != "") {
            let payload = {
                limit: limit,
                page: page,
                keyword: searchQuery,
            };
            dispatch(getSearchResults(payload));
        }
        setFilteredSearchedItems([]);
    }, [searchQuery]);

    // useEffect(() => {
    //   setTimeout(() => {
    //     setLoadingDeafultAssets(false);
    //   }, 2000);
    // }, []);

    useEffect(() => {
        if (selectedFilter !== "all") {
            const newPopular = justAdded.filter(
                (item) => item.content_type === selectedFilter
            );

            const newJustAdded = justAdded.filter(
                (item) => item.content_type === selectedFilter
            );
            setFilterJustAdded(newJustAdded);
            setFilterPoular(newPopular);
        } else {
            setFilterPoular(popular);
            setFilterJustAdded(justAdded);
        }
    }, [selectedFilter, justAdded, popular]);

    useEffect(() => {
        if (popular_data?.length > 0) {
            setPopular(popular_data);
        }
    }, [popular_data]);

    useEffect(() => {
        if (just_added_data?.length > 0) {
            setJustAdded(just_added_data);
        }
    }, [just_added_data]);

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            dispatch(getPopularShows());
            dispatch(getJustAddedShows());
        });
        return unsubscribe;
    }, [navigation, dispatch]);

    const onBackPress = () => {
        router.back();
        setSearchQuery("");
        setSearchedItems([]);
        setFilteredSearchedItems([]);
    };

    const secondsToHoursMinutes = (seconds) => {
        var hours = Math.floor(seconds / 3600);
        var minutes = Math.floor((seconds % 3600) / 60);
        return { hours: hours, minutes: minutes };
    };

    const renderSearchedItems = ({ item }) => {
        const time = secondsToHoursMinutes(item.duration);
        let timeToDisplay = time.hours + "hr " + time.minutes + "min";

        const handlePlay = (type) => {
            if (!userData && !signupData && !forMobileData) {
                router.push("/Login");
            } else {
                if (type === "movie") {
                    router.push({
                        pathname: "/home/MovieDetails",
                        params: {
                            content_id: item?.content_id,
                        },
                    });
                } else if (type === "webseries" || type === "comedy") {
                    router.push({
                        pathname: "/home/SeriesDetails",
                        params: {
                            content_id: item?.content_id,
                        },
                    });
                }
            }
        };

        return (
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => handlePlay(item?.content_type)}
            >
                <View key={item?.content_id} style={styles.searchedItemContainer}>
                    <View>
                        <Text style={styles.searchedItemName}>{item?.title}</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
                        <Text style={styles.searchedItemDuration}>
                            {item?.duration
                                ? msToTime(parseInt(item?.duration))
                                : "Watch Season 1"}
                        </Text>
                        <TouchableOpacity onPress={() => handlePlay(item?.content_type)}>
                            <Ionicons
                                name={"play-circle-outline"}
                                size={25}
                                color={"white"}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <LinearGradient
                    colors={[Colors.dark.secondary, "gray"]}
                    start={[0, 0]}
                    end={[1, 0]}
                    style={styles.gradient}
                />
            </TouchableOpacity>
        );
    };

    const renderNoItems = () => {
        if (filteredSearchedItems.length === 0) {
            return (
                <View style={styles.noItemsContainer}>
                    <Text style={styles.noItemsText}>No items found!</Text>
                </View>
            );
        }
        return null;
    };

    const renderPopular = ({ item }) => {
        return (
            <AssetsForSearch
                key={item.id}
                item={item}
                isSearch={true}
                loading={popular_loading}
            />
        );
    };

    const hanldeFilterChange = (type) => {
        setSelectedFilter(type);
    };

    return (
        <SafeAreaView style={styles.container}>
            <BackNavigation onBackPress={onBackPress} />

            <KeyboardAvoidingView behavior="padding" style={styles.searchContainer}>
                <TextInput
                    placeholder="Search for titles, geners or shows"
                    style={styles.input}
                    onChangeText={(value) => setSearchQuery(value)}
                    value={searchQuery}
                    placeholderTextColor="#8E8E8E"
                    cursorColor={Colors.dark.secondary}
                />
                {search_loading ? (
                    <ActivityIndicator color={Colors.dark.secondary} size={"small"} />
                ) : (
                    <Feather name="search" size={25} color={"white"} />
                )}
            </KeyboardAvoidingView>

            {searchQuery === "" ? (
                <>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.filterTopContainer}
                    >
                        {filters.map((filter, ind) => {
                            return (
                                <TouchableOpacity
                                    key={ind}
                                    onPress={() => setSelectedFilter(filter.type)}
                                >
                                    <View
                                        style={[
                                            styles.filterContainer,
                                            {
                                                color:
                                                    selectedFilter === filter.type
                                                        ? Colors.dark.secondary
                                                        : "white",
                                                borderBottomWidth:
                                                    selectedFilter === filter.type ? 2 : 0,
                                                borderBottomColor: Colors.dark.secondary,
                                            },
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.filterType,
                                                {
                                                    color:
                                                        selectedFilter === filter.type ? "white" : "gray",
                                                },
                                            ]}
                                        >
                                            {filter.title}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View>
                            {just_added_loading ? (
                                <HeadingLoader styles={{ marginTop: 0 }} />
                            ) : (
                                <View style={styles.showsView}>
                                    <Text
                                        style={{ color: "white", fontSize: 17, fontWeight: "bold" }}
                                    >
                                        Popular Shows
                                    </Text>
                                    {/* <TouchableOpacity>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Text style={{ color: "white", fontSize: 12 }}>
                        View More
                      </Text>
                      <Ionicons
                        name="chevron-forward-outline"
                        size={12}
                        color={"white"}
                        style={{ top: 2 }}
                      />
                    </View>
                  </TouchableOpacity> */}
                                </View>
                            )}

                            <View style={{ marginBottom: 25 }}>
                                <FlatList
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    data={filterJustAdded}
                                    renderItem={renderPopular}
                                    keyExtractor={(item) => item.id}
                                />
                            </View>
                        </View>

                        <View>
                            {popular_loading ? (
                                <HeadingLoader styles={{ marginTop: 0 }} />
                            ) : (
                                <View style={[styles.showsView, { marginTop: 0 }]}>
                                    <Text
                                        style={{ color: "white", fontSize: 17, fontWeight: "bold" }}
                                    >
                                        Our Top Picks
                                    </Text>
                                    {/* <TouchableOpacity>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Text style={{ color: "white", fontSize: 12 }}>
                        View More
                      </Text>
                      <Ionicons
                        name="chevron-forward-outline"
                        size={12}
                        color={"white"}
                        style={{ top: 2 }}
                      />
                    </View>
                  </TouchableOpacity> */}
                                </View>
                            )}

                            <View style={{ marginBottom: 25 }}>
                                <FlatList
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    data={filterPopular}
                                    renderItem={renderPopular}
                                    keyExtractor={(item) => item.content_id.toString()}
                                />
                            </View>
                        </View>

                        <View>
                            {just_added_loading ? (
                                <HeadingLoader styles={{ marginTop: 0 }} />
                            ) : (
                                <View style={[styles.showsView, { marginTop: 0 }]}>
                                    <Text
                                        style={{ color: "white", fontSize: 17, fontWeight: "bold" }}
                                    >
                                        Limited Shows
                                    </Text>
                                    {/* <TouchableOpacity>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Text style={{ color: "white", fontSize: 12 }}>
                        View More
                      </Text>
                      <Ionicons
                        name="chevron-forward-outline"
                        size={12}
                        color={"white"}
                        style={{ top: 2 }}
                      />
                    </View>
                  </TouchableOpacity> */}
                                </View>
                            )}

                            <View style={{ marginBottom: 25 }}>
                                <FlatList
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    data={filterJustAdded}
                                    renderItem={renderPopular}
                                    keyExtractor={(item) => item.content_id}
                                />
                            </View>
                        </View>

                        <View>
                            {popular_loading ? (
                                <HeadingLoader style={{ marginTop: 0 }} />
                            ) : (
                                <View style={[styles.showsView, { marginTop: 0 }]}>
                                    <Text
                                        style={{ color: "white", fontSize: 17, fontWeight: "bold" }}
                                    >
                                        Recently Added
                                    </Text>
                                    {/* <TouchableOpacity>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Text style={{ color: "white", fontSize: 12 }}>
                        View More
                      </Text>
                      <Ionicons
                        name="chevron-forward-outline"
                        size={12}
                        color={"white"}
                        style={{ top: 2 }}
                      />
                    </View>
                  </TouchableOpacity> */}
                                </View>
                            )}

                            <View style={{ marginBottom: 25 }}>
                                <FlatList
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    data={filterPopular}
                                    renderItem={renderPopular}
                                    keyExtractor={(item) => item.content_id}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </>
            ) : (
                <View style={{ marginHorizontal: 10 }}>
                    {search_loading ? (
                        <SkeletonLoading background={"#3e3e3eff"} highlight={"#1e1e1eff"}>
                            <View style={{ padding: 10, marginVertical: 20, ackground: "#3e3e3eff" }}>
                                <View
                                    style={{
                                        marginBottom: 20,
                                        width: width * 0.9,
                                        height: 15,
                                        borderRadius: 10,
                                        ackground: "#3e3e3eff"
                                    }}
                                />
                                <View
                                    style={{
                                        marginBottom: 20,
                                        width: width * 0.9,
                                        height: 15,
                                        borderRadius: 10,
                                        ackground: "#3e3e3eff"
                                    }}
                                />
                                <View
                                    style={{
                                        marginBottom: 20,
                                        width: width * 0.9,
                                        height: 15,
                                        borderRadius: 10,
                                        ackground: "#3e3e3eff"
                                    }}
                                />
                                <View
                                    style={{
                                        marginBottom: 20,
                                        width: width * 0.9,
                                        height: 15,
                                        borderRadius: 10,
                                        ackground: "#3e3e3eff"
                                    }}
                                />
                            </View>
                        </SkeletonLoading>
                    ) : filteredSearchedItems.length > 0 ? (
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={filteredSearchedItems}
                            renderItem={renderSearchedItems}
                            keyExtractor={(item) => item?.content_id?.toString()}
                        />
                    ) : (
                        <View style={styles.noItemsContainer}>
                            <Text style={styles.noItemsText}>No items found!</Text>
                        </View>
                    )}
                    {/* {renderNoItems()} */}
                </View>
            )}
        </SafeAreaView>
    );
};

export default Search;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.primary100,
    },

    searchContainer: {
        marginHorizontal: 20,
        borderWidth: 1,
        borderColor: "white",
        backgroundColor: "#202029",
        height: "7%",
        justifyContent: "center",
        paddingHorizontal: 10,
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    input: {
        fontSize: 14,
        color: "white",
        width: "90%",
        height: "100%",
    },

    searchedItemContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        paddingVertical: 20,
    },
    searchedItemName: {
        color: "white",
        fontSize: 15,
    },
    searchedItemDuration: {
        color: "gray",
        fontSize: 13,
    },
    gradient: {
        height: 1,
        width: "100%",
    },

    noItemsContainer: {
        alignItems: "center",
        paddingVertical: 20,
    },
    noItemsText: {
        color: "white",
        fontSize: 18,
    },

    showsView: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginHorizontal: 15,
        marginVertical: 12,
        marginTop: 0,
    },

    filterContainer: {
        marginVertical: 20,
        marginHorizontal: 15,
    },

    filterTopContainer: {
        flexDirection: "row",
        height: 100,
    },

    filterType: {
        color: "white",
        fontSize: 17,
        fontWeight: "bold",
        marginBottom: 2,
    },
});
