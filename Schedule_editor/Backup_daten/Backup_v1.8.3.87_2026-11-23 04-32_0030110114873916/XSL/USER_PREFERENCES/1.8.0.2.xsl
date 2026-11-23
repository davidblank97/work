<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line-->

	<xsl:template match="/user_preferences">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()"/>
			<xsl:choose>
				<xsl:when test="/user_preferences/preference[@tag='mig_pulse_trigger_offset']"/>
				<xsl:otherwise>
					<preference tag="mig_pulse_trigger_offset" value="0.0015"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:copy>
	</xsl:template>
	
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>
</xsl:stylesheet>