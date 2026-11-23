<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->
	<xsl:template match="sched/@head">
		<xsl:variable name="weldheadname" select="'F-STEERING'" />
		<xsl:variable name="weldheadname_F-STEERING" select="'F-STEERING'" />
		<xsl:variable name="weldheadname_S_HEAD" select="'S HEAD'" />
		<xsl:attribute name="head">
			<xsl:choose>
				<xsl:when test=". = $weldheadname">F</xsl:when>
				<xsl:when test=". = $weldheadname_F-STEERING">F</xsl:when>
				<!-- Temporary for CAT build ONLY  -->
				<xsl:when test=". = $weldheadname_S_HEAD">C</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="." />
				</xsl:otherwise>
			</xsl:choose>
		</xsl:attribute>
	</xsl:template>

	<xsl:template match="sched/global/avc_gap">
		<ahc_gap>
			<xsl:apply-templates select="@*|node()"/>
		</ahc_gap>
	</xsl:template>
	<xsl:template match="sched/global/avc_retract">
		<ahc_retract>
			<xsl:apply-templates select="@*|node()"/>
		</ahc_retract>
	</xsl:template>
	<xsl:template match="sched/global/avc_delay">
		<ahc_delay>
			<xsl:apply-templates select="@*|node()"/>
		</ahc_delay>
	</xsl:template>
	<xsl:template match="sched/global/avc_stop_delay">
		<ahc_stop_delay>
			<xsl:apply-templates select="@*|node()"/>
		</ahc_stop_delay>
	</xsl:template>
	<xsl:template match="sched/global/avc_jog">
		<ahc_jog>
			<xsl:apply-templates select="@*|node()"/>
		</ahc_jog>
	</xsl:template>
	<xsl:template match="sched/global/avc_step">
		<ahc_step>
			<xsl:apply-templates select="@*|node()"/>
		</ahc_step>
	</xsl:template>
	<xsl:template match="sched/global/groovetrack_max_correction_mode">
		<groovetrack_max_correction_edit_mode>
			<xsl:apply-templates select="@*|node()"/>
		</groovetrack_max_correction_edit_mode>
	</xsl:template>
	<xsl:template match="sched/global/groovetrack_sensitivity_mode">
		<groovetrack_sensitivity_edit_mode>
			<xsl:apply-templates select="@*|node()"/>
		</groovetrack_sensitivity_edit_mode>
	</xsl:template>

	<xsl:template match="sched/global/mig_sensitivity" />
	<xsl:template match="sched/global/wire_runin_rate" />

	<xsl:template match="sched/global/data_sampler_powersupply_moving_average"/>
	<xsl:template match="sched/global/initial_wire_speed"/>
	<xsl:template match="sched/global/acc_compound_angle"/>
	<xsl:template match="sched/global/*[last()]">
		<xsl:copy-of select="."/>
		<xsl:copy-of select="/sched/global/avc_sensitivity"/>
		<xsl:copy-of select="/sched/global/avc_high_sensitivity"/>
		<xsl:copy-of select="/sched/global/avc_deadband"/>
		<xsl:copy-of select="/sched/global/avc_slowband"/>
		<acc_sensitivity>0.2</acc_sensitivity>
		<acc_high_sensitivity>0.2</acc_high_sensitivity>
		<acc_deadband>1</acc_deadband>
		<acc_slowband>5</acc_slowband>
		<flying_start>0.0</flying_start>
		<xsl:choose>
			<xsl:when test="/sched/global/data_sampler_powersupply_moving_average">
				<xsl:copy-of select="/sched/global/data_sampler_powersupply_moving_average"/>
			</xsl:when>
			<xsl:otherwise>
				<data_sampler_powersupply_moving_average>0</data_sampler_powersupply_moving_average>
			</xsl:otherwise>
		</xsl:choose>

		<xsl:choose>
			<xsl:when test="/sched/global/initial_wire_speed">
				<xsl:copy-of select="/sched/global/initial_wire_speed"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:choose>
					<xsl:when test="/sched/global/arc_type = 'MIG'">
						<initial_wire_speed>100</initial_wire_speed>
					</xsl:when>
					<xsl:when test="/sched/global/arc_type = 'POWERWAVE'">
						<initial_wire_speed>100</initial_wire_speed>
					</xsl:when>
					<xsl:otherwise>
						<initial_wire_speed>0</initial_wire_speed>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:otherwise>
		</xsl:choose>

		<xsl:choose>
			<xsl:when test="/sched/global/acc_compound_angle">
				<xsl:copy-of select="/sched/global/acc_compound_angle"/>
			</xsl:when>
			<xsl:otherwise>
				<acc_compound_angle>0</acc_compound_angle>
			</xsl:otherwise>
		</xsl:choose>

	</xsl:template>

	<xsl:template match="sched/global/avc_sensitivity"/>
	<xsl:template match="sched/global/avc_high_sensitivity"/>
	<xsl:template match="sched/global/avc_deadband"/>
	<xsl:template match="sched/global/avc_slowband"/>

	<xsl:template match="sched/overrides/prox_override_max">
		<acc_override_max>
			<xsl:apply-templates select="@*|node()"/>
		</acc_override_max>
	</xsl:template>

	<xsl:template match="sched/overrides/prox_override_rate">
		<acc_override_rate>
			<xsl:apply-templates select="@*|node()"/>
		</acc_override_rate>
		<avc_override_max>
			<xsl:value-of select="/sched/overrides/volt_max"/>
		</avc_override_max>
		<avc_override_rate>
			<xsl:value-of select="/sched/overrides/volt_rate"/>
		</avc_override_rate>
	</xsl:template>

	<xsl:template match="sched/segment/prox">
		<pri_ahc>0</pri_ahc>
		<bkg_ahc>0</bkg_ahc>
		<volts>10</volts>
	</xsl:template>

	<xsl:template match="sched/segment/pri_volt" />
	<xsl:template match="sched/segment/bkg_volt" />

	<xsl:template match="sched/segment/*[last()]">
		<xsl:copy-of select="."/>
		<xsl:choose>
			<xsl:when test="/sched/global/mig_sensitivity">
				<xsl:copy-of select="/sched/global/mig_sensitivity"/>
			</xsl:when>
			<xsl:otherwise>
				<mig_sensitivity>0.01</mig_sensitivity>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>