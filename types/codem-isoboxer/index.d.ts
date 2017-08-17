
declare module "codem-isoboxer" {

    interface AtomData {
        offset: number;
    }

    interface CodemISO {
        fetchAll: <A>(atomName: string) => Array<A>;
    }

    export interface MDHDAtom {
        timescale: number;
    }

    export interface MOOFAtom {
        _raw: DataView;
    }

    export interface TRUNAtom {
        _cursor: AtomData;
        samples: Array<Sample>;
        data_offset: number;
    }

    export interface Sample {
        sample_composition_time_offset: number;
        sample_size: number;
        sample_duration: number;
    }

    export interface TFDTAtom {
        baseMediaDecodeTime: number;
    }

    export var parseBuffer: (ab: ArrayBuffer) => CodemISO;

}

