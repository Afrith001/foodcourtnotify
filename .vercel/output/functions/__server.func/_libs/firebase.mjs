import { r as __exportAll } from "../_runtime.mjs";
import { c as registerVersion } from "./@firebase/app+[...].mjs";
import { A as writeBatch, C as onSnapshot, D as setDoc, E as runTransaction, O as updateDoc, S as limit, T as query, _ as executeWrite, a as QueryConstraint, b as getDoc, c as QueryLimitConstraint, d as SnapshotMetadata, f as Transaction, g as deleteDoc, h as count, i as QueryCompositeFilterConstraint, j as collection, k as where, l as QueryOrderByConstraint, m as addDoc, n as AggregateQuerySnapshot, o as QueryDocumentSnapshot, p as WriteBatch, r as DocumentSnapshot, s as QueryFieldFilterConstraint, t as AggregateField, u as QuerySnapshot, v as getAggregateFromServer, w as orderBy, x as getDocs, y as getCountFromServer } from "./@firebase/firestore+[...].mjs";
import "./firebase__auth.mjs";
import "./firebase__messaging.mjs";
//#region node_modules/firebase/firestore/dist/index.mjs
var dist_exports = /* @__PURE__ */ __exportAll({
	AggregateField: () => AggregateField,
	AggregateQuerySnapshot: () => AggregateQuerySnapshot,
	CACHE_SIZE_UNLIMITED: () => -1,
	DocumentSnapshot: () => DocumentSnapshot,
	QueryCompositeFilterConstraint: () => QueryCompositeFilterConstraint,
	QueryConstraint: () => QueryConstraint,
	QueryDocumentSnapshot: () => QueryDocumentSnapshot,
	QueryFieldFilterConstraint: () => QueryFieldFilterConstraint,
	QueryLimitConstraint: () => QueryLimitConstraint,
	QueryOrderByConstraint: () => QueryOrderByConstraint,
	QuerySnapshot: () => QuerySnapshot,
	SnapshotMetadata: () => SnapshotMetadata,
	Transaction: () => Transaction,
	WriteBatch: () => WriteBatch,
	addDoc: () => addDoc,
	collection: () => collection,
	count: () => count,
	deleteDoc: () => deleteDoc,
	executeWrite: () => executeWrite,
	getAggregateFromServer: () => getAggregateFromServer,
	getCountFromServer: () => getCountFromServer,
	getDoc: () => getDoc,
	getDocs: () => getDocs,
	limit: () => limit,
	onSnapshot: () => onSnapshot,
	orderBy: () => orderBy,
	query: () => query,
	runTransaction: () => runTransaction,
	setDoc: () => setDoc,
	updateDoc: () => updateDoc,
	where: () => where,
	writeBatch: () => writeBatch
});
//#endregion
//#region node_modules/firebase/app/dist/index.mjs
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
registerVersion("firebase", "12.15.0", "app");
//#endregion
export { dist_exports as t };
