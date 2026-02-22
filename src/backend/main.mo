import Array "mo:core/Array";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Set "mo:core/Set";
import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Nat64 "mo:core/Nat64";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();

  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type VideoSource = {
    #youtube : Text;
    #instagramReel : Text;
    #unknown : Text;
  };

  public type VideoStatus = {
    #watched;
    #watchLater;
    #notInterested;
    #noResponse; // New status for no response
  };

  public type Video = {
    id : Text;
    url : Text;
    title : Text;
    thumbnailUrl : Text;
    source : VideoSource;
    postedAt : Time.Time;
  };

  public type EngagementRecord = {
    user : Principal;
    videoId : Text;
    status : VideoStatus;
    timestamp : Time.Time;
  };

  module Video {
    public func compareByPostedAt(v1 : Video, v2 : Video) : Order.Order {
      Nat64.compare(
        Nat64.fromIntWrap(v1.postedAt),
        Nat64.fromIntWrap(v2.postedAt)
      );
    };
  };

  module EngagementRecord {
    public func compareByTimestamp(r1 : EngagementRecord, r2 : EngagementRecord) : Order.Order {
      Nat64.compare(
        Nat64.fromIntWrap(r1.timestamp),
        Nat64.fromIntWrap(r2.timestamp)
      );
    };
  };

  let videos = Map.empty<Text, Video>();
  let engagementRecords = Map.empty<Principal, Map.Map<Text, EngagementRecord>>();
  let videoReminders = Map.empty<Text, Bool>(); // Track if reminder sent for a video

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    ?("Sample Profile Data");
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?Text {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    ?("Sample Profile Data");
  };

  public shared ({ caller }) func saveCallerUserProfile() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
  };

  // Video Management
  public shared ({ caller }) func addVideo(url : Text, title : Text, thumbnailUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add videos");
    };
    "SampleVideoId";
  };

  public query ({ caller }) func getVideo(_videoId : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view videos");
    };
    "Sample Video Data";
  };

  public query ({ caller }) func getAllVideos() : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view videos");
    };
    ["Sample Video 1", "Sample Video 2"];
  };

  public query ({ caller }) func getUserVideoStatus(_user : Principal, _videoId : Text) : async VideoStatus {
    if (caller != _user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own video status");
    };
    #noResponse;
  };

  public shared ({ caller }) func setUserVideoStatus(_videoId : Text, _status : VideoStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can set video status");
    };
  };

  public query ({ caller }) func getAdminDashboard() : async ([Text], [Text]) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access the dashboard");
    };
    (["Sample Video"], ["Sample Record"]);
  };

  public query ({ caller }) func getUsersWithoutResponse(_videoId : Text) : async [Principal] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access this");
    };
    [Principal.fromText("SamplePrincipal")];
  };

  public query ({ caller }) func getAllVideoEngagements(_videoId : Text) : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access this");
    };
    ["Sample EngagementRecord"];
  };
};
