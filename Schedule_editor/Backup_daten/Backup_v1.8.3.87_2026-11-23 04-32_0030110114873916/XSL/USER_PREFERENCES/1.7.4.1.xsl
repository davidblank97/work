<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line-->

	<xsl:template match="/user_preferences/preference[@tag='active_weld_heads']/*">
		<xsl:choose>
			<xsl:when test=".= 'CFS SPARC COMPOUND'">
				<value>
					<xsl:value-of select="'CFS SPARC COMPOUND MP'"/>
				</value>
			</xsl:when>
			<xsl:otherwise>
				<xsl:copy-of select="."/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
	<xsl:template match="/user_preferences/preference[@tag='closed_weld_path_start_tolerance']">
		<xsl:copy-of select="."/>
		<preference tag="closed_weld_path_soft_limit_offset" value="0.1"/>
	</xsl:template>
	
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>
</xsl:stylesheet>