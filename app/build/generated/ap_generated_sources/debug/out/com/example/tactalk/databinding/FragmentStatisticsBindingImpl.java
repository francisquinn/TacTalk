package com.example.tactalk.databinding;
import com.example.tactalk.R;
import com.example.tactalk.BR;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import android.view.View;
@SuppressWarnings("unchecked")
public class FragmentStatisticsBindingImpl extends FragmentStatisticsBinding  {

    @Nullable
    private static final androidx.databinding.ViewDataBinding.IncludedLayouts sIncludes;
    @Nullable
    private static final android.util.SparseIntArray sViewsWithIds;
    static {
        sIncludes = null;
        sViewsWithIds = new android.util.SparseIntArray();
        sViewsWithIds.put(R.id.textView, 2);
        sViewsWithIds.put(R.id.second_half, 3);
        sViewsWithIds.put(R.id.end_game, 4);
        sViewsWithIds.put(R.id.textView3, 5);
        sViewsWithIds.put(R.id.textView4, 6);
    }
    // views
    @NonNull
    private final androidx.constraintlayout.widget.ConstraintLayout mboundView0;
    // variables
    // values
    // listeners
    // Inverse Binding Event Handlers

    public FragmentStatisticsBindingImpl(@Nullable androidx.databinding.DataBindingComponent bindingComponent, @NonNull View root) {
        this(bindingComponent, root, mapBindings(bindingComponent, root, 7, sIncludes, sViewsWithIds));
    }
    private FragmentStatisticsBindingImpl(androidx.databinding.DataBindingComponent bindingComponent, View root, Object[] bindings) {
        super(bindingComponent, root, 1
            , (android.widget.Button) bindings[4]
            , (android.widget.Button) bindings[3]
            , (android.widget.TextView) bindings[2]
            , (android.widget.TextView) bindings[1]
            , (android.widget.TextView) bindings[5]
            , (android.widget.TextView) bindings[6]
            );
        this.mboundView0 = (androidx.constraintlayout.widget.ConstraintLayout) bindings[0];
        this.mboundView0.setTag(null);
        this.textView11.setTag(null);
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
        if (BR.statsViewModel == variableId) {
            setStatsViewModel((com.example.tactalk.statistics.StatisticViewModel) variable);
        }
        else {
            variableSet = false;
        }
            return variableSet;
    }

    public void setStatsViewModel(@Nullable com.example.tactalk.statistics.StatisticViewModel StatsViewModel) {
        this.mStatsViewModel = StatsViewModel;
        synchronized(this) {
            mDirtyFlags |= 0x2L;
        }
        notifyPropertyChanged(BR.statsViewModel);
        super.requestRebind();
    }

    @Override
    protected boolean onFieldChange(int localFieldId, Object object, int fieldId) {
        switch (localFieldId) {
            case 0 :
                return onChangeStatsViewModelProperty((androidx.lifecycle.LiveData<com.example.tactalk.network.statistics.StatsProperty>) object, fieldId);
        }
        return false;
    }
    private boolean onChangeStatsViewModelProperty(androidx.lifecycle.LiveData<com.example.tactalk.network.statistics.StatsProperty> StatsViewModelProperty, int fieldId) {
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
        com.example.tactalk.network.statistics.StatsProperty statsViewModelPropertyGetValue = null;
        java.lang.String statsViewModelPropertyResultTeamGoal = null;
        androidx.lifecycle.LiveData<com.example.tactalk.network.statistics.StatsProperty> statsViewModelProperty = null;
        com.example.tactalk.network.statistics.Response statsViewModelPropertyResult = null;
        com.example.tactalk.statistics.StatisticViewModel statsViewModel = mStatsViewModel;

        if ((dirtyFlags & 0x7L) != 0) {



                if (statsViewModel != null) {
                    // read statsViewModel.property
                    statsViewModelProperty = statsViewModel.getProperty();
                }
                updateLiveDataRegistration(0, statsViewModelProperty);


                if (statsViewModelProperty != null) {
                    // read statsViewModel.property.getValue()
                    statsViewModelPropertyGetValue = statsViewModelProperty.getValue();
                }


                if (statsViewModelPropertyGetValue != null) {
                    // read statsViewModel.property.getValue().result
                    statsViewModelPropertyResult = statsViewModelPropertyGetValue.getResult();
                }


                if (statsViewModelPropertyResult != null) {
                    // read statsViewModel.property.getValue().result.teamGoal
                    statsViewModelPropertyResultTeamGoal = statsViewModelPropertyResult.getTeamGoal();
                }
        }
        // batch finished
        if ((dirtyFlags & 0x7L) != 0) {
            // api target 1

            androidx.databinding.adapters.TextViewBindingAdapter.setText(this.textView11, statsViewModelPropertyResultTeamGoal);
        }
    }
    // Listener Stub Implementations
    // callback impls
    // dirty flag
    private  long mDirtyFlags = 0xffffffffffffffffL;
    /* flag mapping
        flag 0 (0x1L): statsViewModel.property
        flag 1 (0x2L): statsViewModel
        flag 2 (0x3L): null
    flag mapping end*/
    //end
}