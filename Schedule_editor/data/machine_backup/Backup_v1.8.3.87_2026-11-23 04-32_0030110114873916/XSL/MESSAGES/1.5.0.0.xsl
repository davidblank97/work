<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output  omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:template match="/language[@localeID='en-CA' and @fileType='EXE']">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()"/>
			<str id="18">
				<text>There are too many instructions included in the weld program. Please reduce the loop count or the number of enabled segments in the schedule and start again.</text>
				<desc>The user has included more segments than the system can handle. They need to reduce the number of segments before they can attempt to start the weld again.</desc>
			</str>
		</xsl:copy>
	</xsl:template>

	<xsl:template match="/language[@localeID='en-CA' and @fileType='SEC']">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()"/>
			<str id="16">
				<text>User %1 logged in with USB key.</text>
				<desc>%1 = user name</desc>
			</str>
			<str id="17">
				<text>A USB security key already exists. Do you want to override the existing key?</text>
				<desc>N/A</desc>
			</str>
			<str id="18">
				<text>A security key was detected but is not compatible with this system. Ensure that the key file is correct and try again or log in using credentials.</text>
				<desc>N/A</desc>
			</str>
			<str id="19">
				<text>A security key was detected belonging to a fleet that this system is not a part of. Please log in using credentials.</text>
				<desc>N/A</desc>
			</str>
			<str id="20">
				<text>Created a USB Key for user %1.</text>
				<desc>%1 = User Name assigned to a digital USB Key.</desc>
			</str>
		</xsl:copy>
	</xsl:template>

	<xsl:template match="/language[@localeID='en-CA' and @fileType='TTL']">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()"/>
			<str id="34">
				<text>USB KEY LOGIN</text>
				<desc>Title for USB key login.</desc>
			</str>
		</xsl:copy>
	</xsl:template>
	
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>