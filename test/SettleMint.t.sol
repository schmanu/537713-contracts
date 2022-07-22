// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/SettleMint.sol";

contract SettleMintTest is Test {
    event AddedOwner(address indexed account);
    event AddedMember(address indexed account);

    event NewExpense(address indexed payer, uint amount, address[] participants);


    address mockToken = address(321);

    address member1 = address(2);
    address member2 = address(3);
    address member3 = address(4);

    function setUp() public {}

    function testOneMember() public {
        address[] memory  members = new address[](1);
        members[0] = member1;
        vm.expectEmit(true, false, false, true);
        emit AddedMember(member1);
        vm.expectEmit(true, false, false, true);
        emit AddedOwner(address(this));
        SettleMint settlemint = new SettleMint(mockToken, members);
        
        assertTrue(settlemint.isMember(member1));
        assertFalse(settlemint.isMember(member2));
        assertTrue(settlemint.isOwner(address(this)));
        assertFalse(settlemint.isOwner(member1));
    }

    function testMultipleMembers() public {
        address[] memory  members = new address[](3);
        members[0] = member1;
        members[1] = member2;
        members[2] = member3;
        vm.expectEmit(true, false, false, true);
        emit AddedMember(member1);

        vm.expectEmit(true, false, false, true);
        emit AddedMember(member2);

        vm.expectEmit(true, false, false, true);
        emit AddedMember(member3);

        vm.expectEmit(true, false, false, true);
        emit AddedOwner(address(this));

        SettleMint settlemint = new SettleMint(mockToken, members);
        
        assertTrue(settlemint.isMember(member1));
        assertTrue(settlemint.isMember(member2));
        assertTrue(settlemint.isMember(member3));

        assertTrue(settlemint.isOwner(address(this)));
        assertFalse(settlemint.isOwner(member1));
    }

    function testAddRemoveMembers() public {
        address[] memory  members = new address[](1);
        members[0] = member1;
        SettleMint settlemint = new SettleMint(mockToken, members);
        vm.expectEmit(true, false, false, true);
        emit AddedMember(member2);
        settlemint.addMember(member2);
        settlemint.addMember(member3);

        assertTrue(settlemint.isMember(member1));
        assertTrue(settlemint.isMember(member2));
        assertTrue(settlemint.isMember(member3));

        assertEq(settlemint.balances(member1), 0);
        assertEq(settlemint.balances(member2), 0);
        assertEq(settlemint.balances(member3), 0);


        settlemint.removeMember(member1);
        assertFalse(settlemint.isMember(member1));
        assertTrue(settlemint.isMember(member2));
        assertTrue(settlemint.isMember(member3));
        settlemint.removeMember(member2);
        assertFalse(settlemint.isMember(member1));
        assertFalse(settlemint.isMember(member2));
        assertTrue(settlemint.isMember(member3));
        settlemint.addMember(member1);
        assertTrue(settlemint.isMember(member1));
        assertFalse(settlemint.isMember(member2));
        assertTrue(settlemint.isMember(member3));
        settlemint.removeMember(member1);
        settlemint.removeMember(member3);
        assertFalse(settlemint.isMember(member1));
        assertFalse(settlemint.isMember(member2));
        assertFalse(settlemint.isMember(member3));

        // Expect revert when trying to remove address which is no member
        vm.expectRevert(bytes("Address must be a member"));
        settlemint.removeMember(member1);

        // Expect revert when trying to add member without being an owner
        vm.expectRevert(bytes("Can only be called by owner"));
        vm.prank(member2);
        settlemint.addMember(member1);
    }

    function testAddRemoveOwners() public {
        address[] memory  members = new address[](1);
        members[0] = member1;
        SettleMint settlemint = new SettleMint(mockToken, members);


        // Expect revert when trying to remove the only owner
        vm.expectRevert(bytes("Cannot remove the last owner"));
        settlemint.removeOwner(address(this));

        // Expect revert when trying to add owner without being an owner
        vm.expectRevert(bytes("Can only be called by owner"));
        vm.prank(member2);
        settlemint.addOwner(member1);

        vm.expectEmit(true, false, false, true);
        emit AddedOwner(member1);
        settlemint.addOwner(member1);
        settlemint.addOwner(member2);

        assertTrue(settlemint.isOwner(member1));
        assertTrue(settlemint.isOwner(member2));
        assertTrue(settlemint.isOwner(address(this)));
        assertFalse(settlemint.isOwner(member3));

        settlemint.removeOwner(member2);
        assertTrue(settlemint.isOwner(member1));
        assertFalse(settlemint.isOwner(member2));
        assertTrue(settlemint.isOwner(address(this)));
        assertFalse(settlemint.isOwner(member3));
    }

    function testExpensesAndBalances() public {
        address[] memory  members = new address[](4);
        members[0] = member1;
        members[1] = member2;
        members[2] = member3;
        // Only members can add expenses
        members[3] = address(this);

        SettleMint settlemint = new SettleMint(mockToken, members);

        // Member 1 pays 1000 to member 2
        {
            address[] memory participants = new address[](1);
            participants[0] = member2;

            vm.expectEmit(true, false, false, true);
            emit NewExpense(member1, 1000, participants);
            settlemint.addExpense(1000, member1, participants);

            assertEq(settlemint.balances(member1), 1000);
            assertEq(settlemint.balances(member2), -1000);
            assertEq(settlemint.balances(member3), 0);
            assertEq(settlemint.totalExpense(), 1000);
        }

        // Member 2 pays 2000 for member 1 and member 3
        {
            address[] memory participants = new address[](2);
            participants[0] = member1;
            participants[1] = member3;

            settlemint.addExpense(2000, member2, participants);

            assertEq(settlemint.balances(member1), 0);
            assertEq(settlemint.balances(member2), 1000);
            assertEq(settlemint.balances(member3), -1000);
            assertEq(settlemint.totalExpense(), 3000);

        }

        // Member 1 pays 3000 for member 1,2 and 3
        {
            address[] memory participants = new address[](3);
            participants[0] = member1;
            participants[1] = member2;
            participants[2] = member3;

            settlemint.addExpense(3000, member1, participants);

            assertEq(settlemint.balances(member1), 2000);
            assertEq(settlemint.balances(member2), 0);
            assertEq(settlemint.balances(member3), -2000);
            assertEq(settlemint.totalExpense(), 6000);
        }

        // Member 1 pays 1000 for itself
        {
            address[] memory participants = new address[](1);
            participants[0] = member1;

            settlemint.addExpense(1000, member1, participants);

            assertEq(settlemint.balances(member1), 2000);
            assertEq(settlemint.balances(member2), 0);
            assertEq(settlemint.balances(member3), -2000);
            assertEq(settlemint.totalExpense(), 7000);
        }
    }

    function testUnsplitableExpense() public {
        address[] memory  members = new address[](4);
        members[0] = member1;
        members[1] = member2;
        members[2] = member3;
        // Only members can add expenses
        members[3] = address(this);

        SettleMint settlemint = new SettleMint(mockToken, members);

        // Member 1 pays 5 for members 2 and 3
        {
            address[] memory participants = new address[](2);
            participants[0] = member2;
            participants[1] = member3;

            settlemint.addExpense(5, member1, participants);

            assertEq(settlemint.balances(member1), 5);
            assertEq(settlemint.balances(member2), -3);
            assertEq(settlemint.balances(member3), -2);
            assertEq(settlemint.totalExpense(), 5);
        }

        // Member 1 pays 11 for members 1, 2 and 3
        {
            address[] memory participants = new address[](3);
            participants[0] = member1;
            participants[1] = member2;
            participants[2] = member3;

            settlemint.addExpense(11, member1, participants);

            assertEq(settlemint.balances(member1), 5 + 11 - 4);
            assertEq(settlemint.balances(member2), -3 - 4);
            assertEq(settlemint.balances(member3), -2 - 3);
            assertEq(settlemint.totalExpense(), 16);
        }
    }

    function testFailUniqueParticipants() public {
        address[] memory  members = new address[](4);
        members[0] = member1;
        members[1] = member2;
        members[2] = member3;
        // Only members can add expenses
        members[3] = address(this);

        SettleMint settlemint = new SettleMint(mockToken, members);

        // Member 1 tries to add member 2 twice to split expense
        {
            address[] memory participants = new address[](3);
            participants[0] = member1;
            participants[1] = member2;
            participants[2] = member2;

            settlemint.addExpense(1000, member1, participants);
        }
    }

    function testFailOnlyMembersCanAddExpenses() public {
        address[] memory  members = new address[](4);
        members[0] = member1;
        members[1] = member2;
        members[2] = member3;

        SettleMint settlemint = new SettleMint(mockToken, members);

        // address(this) is not a member, thus addExpense fails
        {
            address[] memory participants = new address[](2);
            participants[0] = member1;
            participants[1] = member2;

            settlemint.addExpense(1000, member1, participants);
        }
    }
}
