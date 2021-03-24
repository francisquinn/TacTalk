package com.example.tactalk.databinding;
import com.example.tactalk.R;
import com.example.tactalk.BR;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import android.view.View;
@SuppressWarnings("unchecked")
public class FragmentRecordingPageBindingImpl extends FragmentRecordingPageBinding  {

    @Nullable
    private static final androidx.databinding.ViewDataBinding.IncludedLayouts sIncludes;
    @Nullable
    private static final android.util.SparseIntArray sViewsWithIds;
    static {
        sIncludes = null;
        sViewsWithIds = new android.util.SparseIntArray();
        sViewsWithIds.put(R.id.match_time, 3);
        sViewsWithIds.put(R.id.textView7, 4);
        sViewsWithIds.put(R.id.audioRecordView, 5);
        sViewsWithIds.put(R.id.logo, 6);
        sViewsWithIds.put(R.id.endHalf, 7);
        sViewsWithIds.put(R.id.pause, 8);
        sViewsWithIds.put(R.id.firsthalf, 9);
        sViewsWithIds.put(R.id.textView6, 10);
    }
    // views
    @NonNull
    private final androidx.constraintlayout.widget.ConstraintLayout mboundView0;
    // variables
    // values
    // listeners
    // Inverse Binding Event Handlers

    public FragmentRecordingPageBindingImpl(@Nullable androidx.databinding.DataBindingComponent bindingComponent, @NonNull View root) {
        this(bindingComponent, root, mapBindings(bindingComponent, root, 11, sIncludes, sViewsWithIds));
    }
    private FragmentRecordingPageBindingImpl(androidx.databinding.DataBindingComponent bindingComponent, View root, Object[] bindings) {
        super(bindingComponent, root, 1
            , (com.visualizer.amplitude.AudioRecordView) bindings[5]
            , (android.widget.Button) bindings[7]
            , (android.widget.TextView) bindings[9]
            , (android.widget.TextView) bindings[1]
            , (android.widget.TextView) bindings[2]
            , (android.widget.ImageView) bindings[6]
            , (android.widget.Chronometer) bindings[3]
            , (android.widget.Button) bindings[8]
            , (android.widget.TextView) bindings[10]
            , (android.widget.TextView) bindings[4]
            );
        this.homeGoals.setTag(null);
        this.homePoints.setTag(null);
        this.mboundView0 = (androidx.constraintlayout.widget.ConstraintLayout) bindings[0];
        this.mboundView0.setTag(null);
        setRootTag(root);
        // listeners
        invalidateAll();
    }

    @Override
    public void invalidateAll() {
        synchronized(this) {
                mDirtyFlags = 0x4L;
        }
        requestRebind();
    }

    @Override
    public boolean hasPendingBindings() {
        synchronized(this) {
            if (mDirtyFlags != 0) {
                return true;
            }
        }
        return false;
    }

    @Override
    public boolean setVariable(int variableId, @Nullable Object variable)  {
        boolean variableSet = true;
        if (BR.recordViewModel == variableId) {
            setRecordViewModel((com.example.tactalk.recording.RecordingViewModel) variable);
        }
        else {
            variableSet = false;
        }
            return variableSet;
    }

    public void setRecordViewModel(@Nullable com.example.tactalk.recording.RecordingViewModel RecordViewModel) {
        this.mRecordViewModel = RecordViewModel;
        synchronized(this) {
            mDirtyFlags |= 0x2L;
        }
        notifyPropertyChanged(BR.recordViewModel);
        super.requestRebind();
    }

    @Override
    protected boolean onFieldChange(int localFieldId, Object object, int fieldId) {
        switch (localFieldId) {
            case 0 :
                return onChangeRecordViewModelProperty((androidx.lifecycle.LiveData<com.example.tactalk.network.statistics.StatsProperty>) object, fieldId);
        }
        return false;
    }
    private boolean onChangeRecordViewModelProperty(androidx.lifecycle.LiveData<com.example.tactalk.network.statistics.StatsProperty> RecordViewModelProperty, int fieldId) {
        if (fieldId == BR._all) {
            synchronized(this) {
                    mDirtyFlags |= 0x1L;
            }
            return true;
        }
        return false;
    }

    @Override
    protected void executeBindings() {
        long dirtyFlags = 0;
        synchronized(this) {
            dirtyFlags = mDirtyFlags;
            mDirtyFlags = 0;
        }
        java.lang.String recordViewModelPropertyResultTeamPoints = null;
        com.example.tactalk.network.statistics.Response recordViewModelPropertyResult = null;
        androidx.lifecycle.LiveData<com.example.tactalk.network.statistics.StatsProperty> recordViewModelProperty = null;
        java.lang.String recordViewModelPropertyResultTeamGoal = null;
        com.example.tactalk.network.statistics.StatsProperty recordViewModelPropertyGetValue = null;
        com.example.tactalk.recording.RecordingViewModel recordViewModel = mRecordViewModel;

        if ((dirtyFlags & 0x7L) != 0) {



                if (recordViewModel != null) {
                    // read recordViewModel.property
                    recordViewModelProperty = recordViewModel.getProperty();
                }
                updateLiveDataRegistration(0, recordViewModelProperty);


                if (recordViewModelProperty != null) {
                    // read recordViewModel.property.getValue()
                    recordViewModelPropertyGetValue = recordViewModelProperty.getValue();
                }


                if (recordViewModelPropertyGetValue != null) {
                    // read recordViewModel.property.getValue().result
                    recordViewModelPropertyResult = recordViewModelPropertyGetValue.getResult();
                }


                if (recordViewModelPropertyResult != null) {
                    // read recordViewModel.property.getValue().result.teamPoints
                    recordViewModelPropertyResultTeamPoints = recordViewModelPropertyResult.getTeamPoints();
                    // read recordViewModel.property.getValue().result.teamGoal
                    recordViewModelPropertyResultTeamGoal = recordViewModelPropertyResult.getTeamGoal();
                }
        }
        // batch finished
        if ((dirtyFlags & 0x7L) != 0) {
            // api target 1

            androidx.databinding.adapters.TextViewBindingAdapter.setText(this.homeGoals, recordViewModelPropertyResultTeamGoal);
            androidx.databinding.adapters.TextViewBindingAdapter.setText(this.homePoints, recordViewModelPropertyResultTeamPoints);
        }
    }
    // Listener Stub Implementations
    // callback impls
    // dirty flag
    private  long mDirtyFlags = 0xffffffffffffffffL;
    /* flag mapping
        flag 0 (0x1L): recordViewModel.property
        flag 1 (0x2L): recordViewModel
        flag 2 (0x3L): null
    flag mapping end*/
    //end
}