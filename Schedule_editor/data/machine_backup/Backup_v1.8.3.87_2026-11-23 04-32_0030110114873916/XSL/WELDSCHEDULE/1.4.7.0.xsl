<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="yes" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:template match="/sched/global/pipe_diameter_edit_mode">
		<xsl:copy-of select="."/>
		<xsl:choose>
			<xsl:when test="/sched/global/torch_centering_height">
				<!-- DO NOTHING -->
			</xsl:when>
			<xsl:otherwise>
				<torch_centering_height>0.0</torch_centering_height>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template match="/sched/global/gas_flow_edit_mode">
		<xsl:copy-of select="."/>
		<xsl:choose>
			<xsl:when test="/sched/global/theta_tool_center_point">
				<!-- DO NOTHING -->
			</xsl:when>
			<xsl:otherwise>
				<theta_tool_center_point>0</theta_tool_center_point>
				<travel_speed_compensated_by_height>0</travel_speed_compensated_by_height>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
		
	<xsl:template match="sched/segment/backup_flow">
		<xsl:copy-of select="."/>
		<xsl:choose>
			<xsl:when test="sched/segment/cv_min_current">
				<!-- DO NOTHING -->
			</xsl:when>
			<xsl:otherwise>
				<cv_min_current>60</cv_min_current>
				<cv_max_current>500</cv_max_current>
				<mig_pulse_deadband>0.1</mig_pulse_deadband>
				<mig_pulse_slowband>2.0</mig_pulse_slowband>
				<mig_pulse_low_sensitivity>0.1</mig_pulse_low_sensitivity>
				<mig_pulse_high_sensitivity>0.25</mig_pulse_high_sensitivity>
				<mig_pulse_start_delay>0.05</mig_pulse_start_delay>
				<mig_pulse_stop_delay>0</mig_pulse_stop_delay>
				<mig_pulse_exponential_smoothing>0.5</mig_pulse_exponential_smoothing>
				<mig_pulse_p_gain>12.0</mig_pulse_p_gain>
				<mig_pulse_i_gain>0.5</mig_pulse_i_gain>
				<mig_pulse_d_gain>4.0</mig_pulse_d_gain>
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